import { CssValue } from "../types/css.type";

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

const truncateFragment = (text: string, max = 80) => {
  const oneLine = text.replace(/\s+/g, " ").trim();
  return oneLine.length > max ? `${oneLine.slice(0, max)}…` : oneLine;
};

export const reconstructCss = (rules: ParsedCssRule[]): string =>
  rules
    .map(({ selector, properties }) => {
      const lines = Object.entries(properties).map(([prop, value]) => {
        return `  ${toCssProp(prop)}: ${value};`;
      });
      return `${selector} {\n${lines.join("\n")}\n}`;
    })
    .join("\n\n");

/** Strip block comments and collapse trivial whitespace for equality checks. */
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
      const selector = selectorMatch[1].trim();
      const propertiesText = propertiesMatch[1];
      const properties: Record<string, CssValue> = {};
      const propertyPairs = propertiesText
        .split(/[\n;]/)
        .map((pair) => pair.trim())
        .filter(Boolean);

      propertyPairs.forEach((pair) => {
        const trimmed = pair.trim();
        const [prop, value] = trimmed.split(":").map((s) => s.trim());
        if (prop && value) {
          properties[toCamelProp(prop)] = value;
        } else if (trimmed) {
          ignored.push({
            kind: "dropped-property",
            label: `屬性「${truncateFragment(trimmed)}」無法解析為「名稱: 值」，已略過`,
          });
        }
      });

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
