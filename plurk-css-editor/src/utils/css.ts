import { CssValue } from "@/types/css.type";

/** 哪些屬性是「數字要自動補 px」 */
import { StyleKey } from "@/types/css.type";

export const AUTO_PX_PROPS = new Set<StyleKey>([
  "fontSize",
  "borderRadius",
  "letterSpacing",
  "wordSpacing",
  "margin",
  "marginTop",
  "marginRight",
  "marginBottom",
  "marginLeft",
  "padding",
  "paddingTop",
  "paddingRight",
  "paddingBottom",
  "paddingLeft",
  "top",
  "left",
  "right",
  "bottom",
  "width",
  "height",
  "minWidth",
  "minHeight",
  "maxWidth",
  "maxHeight",
  "gap",
]);

/** 哪些屬性「數字不可帶單位（unitless）」 */
export const UNITLESS_PROPS = new Set<StyleKey>([
  "lineHeight",
  "fontWeight",
  "zIndex",
  "opacity",
  "flex",
  //...
]);

/** camelCase -> kebab-case */
export const toCssProp = (camel: string) => camel.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());

/** 依屬性輸出正確 CSS 值（自動補 px / 保留 unitless） */
export const toCssVal = (propCamel: StyleKey, value: CssValue) => {
  if (typeof value !== "number") return String(value).trim()
  //if value is number
  if (UNITLESS_PROPS.has(propCamel)) return String(value)
  if (AUTO_PX_PROPS.has(propCamel)) return `${value}px`
  return `${value}px`
}
