import type { ColorResult, RGBColor } from "react-color";

/**
 * Convert CssValue to a CSS-ready string
 * 把 CssValue 轉成可輸出的 CSS 字串（避免 [object Object]）
 */
export function cssValueToString(value: unknown): string {
  if (value === null || value === undefined) return "";

  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);

  // react-color ColorResult shape: { hex, rgb: { r,g,b,a }, ... }
  const v = value as Partial<ColorResult> & { rgb?: Partial<RGBColor>; hex?: unknown };

  if (typeof v.hex === "string") return v.hex;

  if (v.rgb && typeof v.rgb === "object") {
    const { r, g, b, a } = v.rgb;
    if ([r, g, b].every((n): n is number => typeof n === "number")) {
      if (typeof a === "number") return `rgba(${r}, ${g}, ${b}, ${a})`;
      return `rgb(${r}, ${g}, ${b})`;
    }
  }

  // fallback
  return String(value);
}
