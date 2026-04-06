export type BorderParse =
  | { ok: true, value: string }
  | { ok: false, errors: string[] }

export const BORDER_STYLES = new Set([
  "none", "hidden", "dotted", "dashed", "solid",
  "double", "groove", "ridge", "inset", "outset",
])

// 只允許 rgba( r , g , b , a )，r/g/b 0-255；a 0~1（含小數）
export const RGBA_RE =
  /^rgba\(\s*(25[0-5]|2[0-4]\d|1?\d{1,2})\s*,\s*(25[0-5]|2[0-4]\d|1?\d{1,2})\s*,\s*(25[0-5]|2[0-4]\d|1?\d{1,2})\s*,\s*(0|1|0?\.\d+)\s*\)$/;

const LENGTH_RE = /^0$|^\d+(\.\d+)?(px|em|rem|vh|vw)$/i;

export const normalizeSpaces = (s: string) => {
  return s.trim().replace(/\s+/g, " ");
}

export const normalizeBorder = (input: string): BorderParse => {
  if (!input) return { ok: false, errors: ["Border cannot be empty"] };

  const value = normalizeSpaces(input)
  if (value === "none" || value === "0") return { ok: true, value: "none" };

  // 使用正則表達式來正確解析邊框字串
  const borderRegex = /^(\S+)\s+(\S+)\s+(.+)$/;
  const match = value.match(borderRegex);

  if (!match) {
    return {
      ok: false,
      errors: ["邊框格式錯誤，應為：寬度 樣式 顏色"]
    };
  }

  const [, width, style, color] = match;
  const errors: string[] = [];

  // 驗證寬度
  if (!LENGTH_RE.test(width)) {
    errors.push("邊框寬度格式錯誤（應為：1px、0、0.5rem 等）");
  }

  // 驗證樣式
  if (!BORDER_STYLES.has(style.toLowerCase())) {
    errors.push("邊框樣式錯誤（應為：solid、dashed、dotted 等）");
  }

  // 驗證顏色 - 支援多種顏色格式
  const colorRegex = /^(#([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})|rgba?\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*(?:,\s*(0|1|0?\.\d+)\s*)?\)|hsla?\(\s*\d{1,3}\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%\s*(?:,\s*(0|1|0?\.\d+)\s*)?\)|[a-zA-Z]+)$/;

  if (!colorRegex.test(color)) {
    errors.push("顏色格式錯誤（應為：hex、rgb(a)、hsl(a)、色名等）");
  }

  if (errors.length) return { ok: false, errors };

  // 統一輸出格式：「{width} {style} {color}」
  return {
    ok: true, value: `${width} ${style} ${color}`
  };
}