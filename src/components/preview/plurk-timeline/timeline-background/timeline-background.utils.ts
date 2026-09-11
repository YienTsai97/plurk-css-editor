import { BODY_STYLE_DEFAULTS } from "@/store/styleManager/defaults";
import type { CssValue } from "@/types/css.type";
import {
  TIMELINE_BACKGROUND_EXPORT_DISCLAIMER,
  TIMELINE_BACKGROUND_EXPORT_SHELL,
  TIMELINE_BACKGROUND_SELECTOR,
} from "./timeline-background.constants";

type ExportStyleEntry = {
  value: CssValue;
  source: "registered" | "imported" | "manual";
};

/** 用途：shell 屬性輸出順序（佈局在前，避免 background-* 字母排序蓋過 fixed 層）。 */
const SHELL_PROP_ORDER = [
  "position",
  "width",
  "height",
  "top",
  "left",
  "zIndex",
  "backgroundColor",
] as const;

/** 用途：background-* 輸出順序（image → size → position → repeat → attachment）。 */
const BACKGROUND_PROP_ORDER = [
  "backgroundImage",
  "backgroundSize",
  "backgroundPosition",
  "backgroundRepeat",
  "backgroundAttachment",
] as const;

const toCssPropName = (prop: string) =>
  prop.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());

const getSourceTag = (prop: string, source: ExportStyleEntry["source"]) => {
  if (source === "imported") return `[IMPORTED] ${prop}`;
  if (source === "manual") return `[MANUAL] ${prop}`;
  return null;
};

/** 用途：將圖片網址轉成 CSS background-image 可用的值。 */
export function toBackgroundImageCssValue(href: string): string {
  const v = href.trim();
  if (v === "" || v === "none") return "none";
  if (v.includes('"')) {
    return `url('${v.replace(/'/g, "\\'")}')`;
  }
  return `url("${v}")`;
}

/**
 * 用途：將河道背景 props 格式化為 html 固定層匯出區塊（shell 在前、background-* 在後）。
 * 無 backgroundImage（或 none）時回傳 null。
 */
export function formatTimelineBackgroundExportBlock(
  props: Map<string, ExportStyleEntry>,
): string | null {
  const imageEntry = props.get("backgroundImage");
  const imageValue = imageEntry?.value;
  if (!imageValue || imageValue === "none") return null;

  const lines: string[] = [];
  const propTags: string[] = [TIMELINE_BACKGROUND_EXPORT_DISCLAIMER];

  for (const prop of SHELL_PROP_ORDER) {
    lines.push(
      `  ${toCssPropName(prop)}: ${TIMELINE_BACKGROUND_EXPORT_SHELL[prop]};`,
    );
  }

  for (const prop of BACKGROUND_PROP_ORDER) {
    const entry = props.get(prop);
    const value =
      prop === "backgroundImage"
        ? imageValue
        : (entry?.value ?? BODY_STYLE_DEFAULTS[prop]);

    lines.push(`  ${toCssPropName(prop)}: ${value};`);

    if (entry) {
      const sourceTag = getSourceTag(prop, entry.source);
      if (sourceTag) propTags.push(sourceTag);
    }
  }

  const body = `${TIMELINE_BACKGROUND_SELECTOR} {\n${lines.join("\n")}\n}`;
  return `/* ${propTags.join(" ")} */\n${body}`;
}
