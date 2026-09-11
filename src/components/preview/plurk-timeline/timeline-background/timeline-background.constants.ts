/**
 * 用途：定義河道背景 feature 在 store / 預覽 / 匯出 CSS 使用的常數。
 *
 * - store key：`html`（TIMELINE_BACKGROUND_SELECTOR）
 * - 預覽：`#background_layout` 固定層（見 page.style.tsx）
 * - 匯出：以 `html` 模擬固定背景層（CSS-only 折衷方案）
 *
 * Editable props:
 * - backgroundImage
 * - backgroundSize
 * - backgroundRepeat
 * - backgroundPosition
 * - backgroundAttachment
 */
export const TIMELINE_BACKGROUND_SELECTOR = "html";

/** 用途：匯出／預覽共用的固定背景層 shell（對齊 #background_layout）。 */
export const TIMELINE_BACKGROUND_EXPORT_SHELL = {
  position: "fixed",
  width: "100%",
  height: "100%",
  top: "0px",
  left: "0px",
  zIndex: "-1000",
  backgroundColor: "rgba(0, 0, 0, 0)",
} as const;

/** 用途：匯出 html 背景折衷方案時附加的使用說明。 */
export const TIMELINE_BACKGROUND_EXPORT_DISCLAIMER =
  "建議優先使用 Plurk 本體「上傳背景」；以下 html 為自訂 CSS 折衷方案";
