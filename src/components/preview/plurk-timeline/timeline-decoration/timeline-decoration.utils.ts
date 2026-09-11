import { cssValueToString } from "@/store/styleManager/utils/cssValue";
import type { CssValue } from "@/types/css.type";

/** 用途：判斷時間軸裝飾是否已有可顯示的背景圖（非空、非 none）。 */
export function hasDecorationImage(value: CssValue | undefined): boolean {
  const text = cssValueToString(value).trim();
  return text !== "" && text !== "none";
}

/** 用途：把 store 裡的 backgroundSize（如 `50px`）轉成 NumberSlider 可用的數字。 */
export function parseBackgroundSizePx(value: unknown): number {
  const text = cssValueToString(value).trim();
  const match = text.match(/^(\d+(?:\.\d+)?)/);
  return Number(match?.[1] ?? 50);
}
