import { CssValue } from "../types/css.type";

/** 用途：把 camelCase 屬性轉回 kebab-case，重建給使用者看的 CSS。 */
const toCssProp = (camel: string) => camel.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());

export type ParsedCssRule = {
  selector: string;
  properties: Record<string, CssValue>;
};

export type IgnoredCssItem = {
  kind:
    | "block-comment"
    | "line-comment"
    | "dropped-property"
    | "unclosed-block"
    | "leftover"
    | "merged-into-selector";
  label: string;
};

export type CssImportAnalysis = {
  rules: ParsedCssRule[];
  reconstructed: string;
  ignored: IgnoredCssItem[];
  blockCommentCount: number;
  showReconstructedPreview: boolean;
  commentsWereStripped: boolean;
};

const blockCommentRe = () => /\/\*[\s\S]*?\*\//g;
const fullLineSlashCommentRe = () => /^[ \t]*\/\/[^\r\n]*$/gm;

const toCamelProp = (prop: string) =>
  prop.replace(/-([a-z])/g, (g) => g[1].toUpperCase());

/**
 * 用途：匯出 `#dynamic_logo>img`（無空白）與 store key `#dynamic_logo > img` 對齊，
 * 避免 opacity:0 進錯 selector，hasImage／預覽不同步。
 */
const normalizeImportedSelector = (selector: string): string =>
  selector
    .replace(/#dynamic_logo\s*>\s*img/gi, "#dynamic_logo > img")
    .trim();

/**
 * 用途：把 `background` 縮寫拆成 backgroundImage／Repeat 等 longhand。
 * 噗寶匯出用 `background: url(...) no-repeat;`；若不拆，store 只有 `background`，
 * `hasCustomLogoImage(backgroundImage)` 會一直是 false（整顆殼當 trigger + 控制項灰掉）。
 */
export const expandBackgroundShorthand = (
  properties: Record<string, CssValue>,
): Record<string, CssValue> => {
  const raw = properties.background;
  if (raw === undefined) return properties;

  const text = String(raw).trim();
  const next: Record<string, CssValue> = { ...properties };
  delete next.background;

  if (!text || text === "none") {
    if (next.backgroundImage === undefined) next.backgroundImage = "none";
    return next;
  }

  const urlMatch = text.match(/url\(\s*(['"]?)(.*?)\1\s*\)/i);
  if (urlMatch && next.backgroundImage === undefined) {
    next.backgroundImage = urlMatch[0];
  }

  const repeatMatch = text.match(
    /\b(repeat-x|repeat-y|no-repeat|repeat|space|round)\b/i,
  );
  if (repeatMatch && next.backgroundRepeat === undefined) {
    next.backgroundRepeat = repeatMatch[1].toLowerCase();
  }

  return next;
};

/** 用途：只在第一個冒號切開「名稱: 值」，避免 url(https://...) 被截成 url(https。 */
const splitDeclaration = (declaration: string) => {
  const colonIndex = declaration.indexOf(":");
  if (colonIndex === -1) return null;
  const prop = declaration.slice(0, colonIndex).trim();
  const value = declaration.slice(colonIndex + 1).trim();
  if (!prop || !value) return null;
  return { prop, value };
};

const truncateFragment = (text: string, max = 80) => {
  const oneLine = text.replace(/\s+/g, " ").trim();
  return oneLine.length > max ? `${oneLine.slice(0, max)}…` : oneLine;
};

/** 用途：依實際會套用的 rules 重建 CSS，給匯入對話框對照原文。 */
export const reconstructCss = (rules: ParsedCssRule[]): string =>
  rules
    .map(({ selector, properties }) => {
      const lines = Object.entries(properties).map(([prop, value]) => {
        return `  ${toCssProp(prop)}: ${value};`;
      });
      return `${selector} {\n${lines.join("\n")}\n}`;
    })
    .join("\n\n");

/** 用途：去掉註解與空白差異，判斷要不要顯示「實際會匯入的內容」。 */
export const normalizeCssForCompare = (css: string): string =>
  css
    .replace(blockCommentRe(), "")
    .replace(/\s+/g, " ")
    .replace(/\s*{\s*/g, "{")
    .replace(/\s*}\s*/g, "}")
    .replace(/\s*;\s*/g, ";")
    .replace(/\s*:\s*/g, ":")
    .replace(/;}/g, "}")
    .replace(/;$/, "")
    .trim();

const extractBlockComments = (css: string) => {
  const matches = css.match(blockCommentRe()) ?? [];
  return { count: matches.length, css: css.replace(blockCommentRe(), "") };
};

const extractFullLineSlashComments = (css: string) => {
  const lines: string[] = [];
  const next = css.replace(fullLineSlashCommentRe(), (match) => {
    const trimmed = match.trim();
    if (trimmed) lines.push(trimmed);
    return "";
  });
  return { lines, css: next };
};

/** 用途：解析貼上的 CSS，產出可套用的 rules，並標出會被忽略或改寫的片段。 */
export const analyzeImportedCss = (cssString: string): CssImportAnalysis => {
  const empty: CssImportAnalysis = {
    rules: [],
    reconstructed: "",
    ignored: [],
    blockCommentCount: 0,
    showReconstructedPreview: false,
    commentsWereStripped: false,
  };

  if (!cssString.trim()) return empty;

  const ignored: IgnoredCssItem[] = [];
  const { count: blockCommentCount, css: withoutBlockComments } =
    extractBlockComments(cssString);
  const { lines: slashLines, css: withoutSlash } =
    extractFullLineSlashComments(withoutBlockComments);

  for (const line of slashLines) {
    ignored.push({
      kind: "line-comment",
      label: `「${line}」不是有效的 CSS 註解（CSS 僅支援 /* */），已忽略`,
    });
  }

  const openCommentCount = (cssString.match(/\/\*/g) ?? []).length;
  const closeCommentCount = (cssString.match(/\*\//g) ?? []).length;
  if (openCommentCount > closeCommentCount) {
    ignored.push({
      kind: "unclosed-block",
      label: "有未閉合的 /* 註解，可能影響解析",
    });
  }

  const rules: ParsedCssRule[] = [];
  const ruleMatches = [...withoutSlash.matchAll(/[^}]+}/g)];
  let consumedEnd = 0;
  for (const match of ruleMatches) {
    consumedEnd = (match.index ?? 0) + match[0].length;
  }
  const leftoverRaw = withoutSlash.slice(consumedEnd);

  for (const match of ruleMatches) {
    const rule = match[0];
    const selectorMatch = rule.match(/^([^{]+)/);
    const propertiesMatch = rule.match(/\{([^}]+)\}/);

    if (selectorMatch && propertiesMatch) {
      const selector = normalizeImportedSelector(selectorMatch[1].trim());
      const propertiesText = propertiesMatch[1];
      let properties: Record<string, CssValue> = {};
      const propertyPairs = propertiesText
        .split(/[\n;]/)
        .map((pair) => pair.trim())
        .filter(Boolean);

      propertyPairs.forEach((pair) => {
        const trimmed = pair.trim();
        const parsed = splitDeclaration(trimmed);
        if (parsed) {
          properties[toCamelProp(parsed.prop)] = parsed.value;
        } else if (trimmed) {
          ignored.push({
            kind: "dropped-property",
            label: `屬性「${truncateFragment(trimmed)}」無法解析為「名稱: 值」，已略過`,
          });
        }
      });

      properties = expandBackgroundShorthand(properties);

      if (selector.includes("//")) {
        ignored.push({
          kind: "merged-into-selector",
          label: `「${truncateFragment(selector)}」含有 // 片段，已被併入選擇器，可能無法套用`,
        });
      }

      if (Object.keys(properties).length > 0) {
        rules.push({ selector, properties });
      } else if (selector) {
        ignored.push({
          kind: "leftover",
          label: `選擇器「${truncateFragment(selector)}」沒有可套用的屬性，已忽略`,
        });
      }
    }
  }

  const leftover = leftoverRaw.trim();
  if (leftover) {
    if (leftover.includes("{")) {
      ignored.push({
        kind: "unclosed-block",
        label: `未閉合的 { 區塊已忽略：${truncateFragment(leftover)}`,
      });
    } else {
      ignored.push({
        kind: "leftover",
        label: `無法解析的片段已忽略：${truncateFragment(leftover)}`,
      });
    }
  }

  const reconstructed = reconstructCss(rules);
  const showReconstructedPreview =
    normalizeCssForCompare(cssString) !== normalizeCssForCompare(reconstructed);

  const displayIgnored = [...ignored];
  const hasOtherIssues = ignored.length > 0 || showReconstructedPreview;
  if (blockCommentCount > 0 && hasOtherIssues) {
    displayIgnored.unshift({
      kind: "block-comment",
      label: `已移除 ${blockCommentCount} 則註解`,
    });
  }

  return {
    rules,
    reconstructed,
    ignored: displayIgnored,
    blockCommentCount,
    showReconstructedPreview,
    commentsWereStripped: blockCommentCount > 0,
  };
};
