/**
 * 用途：噗寶（#dynamic_logo）feature 的 selector 與 UI／store 預設常數。
 *
 * Store：
 * - `#dynamic_logo`：backgroundImage / Size / Repeat / Position
 * - `#dynamic_logo > img`：opacity（有自訂圖時為 0）
 *
 * 匯出 img 選擇器為 `#dynamic_logo>img`（`>` 兩側無空白）。
 * 有圖時預覽另注入固定 shell（不進 StyleKey）：width/height 100%、z-index:1、
 * transition:none、pointer-events:none（空白穿透；熱區見 dynamic-logo-hit-zone）。
 */

export const DYNAMIC_LOGO_SELECTOR = "#dynamic_logo";

/** 用途：store／預覽用（`>` 兩側有空白，對齊一般 CSS）。 */
export const DYNAMIC_LOGO_IMG_SELECTOR = "#dynamic_logo > img";

/** 用途：匯出嚴格格式用（`>` 兩側無空白）。 */
export const DYNAMIC_LOGO_EXPORT_IMG_SELECTOR = "#dynamic_logo>img";

/** 用途：原圖倍率預設 100%。 */
export const DYNAMIC_LOGO_DEFAULT_SCALE_PERCENT = 100;

/** 用途：角落錨點預設位移為 0（右上 = calc(100%) calc(0%)）。 */
export const DYNAMIC_LOGO_DEFAULT_OFFSET_X = 0;
export const DYNAMIC_LOGO_DEFAULT_OFFSET_Y = 0;

/** 用途：寫入 store 的預設 background-position（右上、雙 calc）。 */
export const DYNAMIC_LOGO_DEFAULT_POSITION = "calc(100%) calc(0%)";

/** 用途：匯出固定 shell 的 z-index（預覽用 1，見 dynamic-logo-styles）。 */
export const DYNAMIC_LOGO_EXPORT_Z_INDEX = 500;

/** 用途：方向鍵每次微調的步進（px）。 */
export const DYNAMIC_LOGO_POSITION_STEP_PX = 10;

/** 用途：大小滑桿／輸入的合理範圍（原圖倍率 %）。 */
export const DYNAMIC_LOGO_SCALE_MIN = 10;
export const DYNAMIC_LOGO_SCALE_MAX = 500;

/** 用途：四角定位預設（offsets 歸零）。 */
export type LogoCorner = "top-right" | "top-left" | "bottom-right" | "bottom-left";

export const LOGO_CORNER_LABELS: Record<LogoCorner, string> = {
  "top-right": " ╗",
  "top-left": "╔",
  "bottom-right": "╝",
  "bottom-left": "╚",
};
