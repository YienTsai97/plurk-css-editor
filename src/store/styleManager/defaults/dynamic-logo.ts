import type { StyleProps } from "../types";

export type DynamicLogoStyleDefaults = Required<
  Pick<
    StyleProps,
    | "backgroundImage"
    | "backgroundSize"
    | "backgroundRepeat"
    | "backgroundPosition"
  >
>;

export type DynamicLogoImgStyleDefaults = Required<Pick<StyleProps, "opacity">>;

/**
 * 用途：`#dynamic_logo` 可編輯 background-* 預設。
 * position 預設右上：`calc(100%) calc(0%)`。
 */
export const DYNAMIC_LOGO_STYLE_DEFAULTS = {
  backgroundImage: "none",
  backgroundSize: "auto",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "calc(100%) calc(0%)",
} satisfies DynamicLogoStyleDefaults;

/** 用途：`#dynamic_logo > img` 預設不隱藏官方噗寶；有自訂圖時再寫成 0。 */
export const DYNAMIC_LOGO_IMG_STYLE_DEFAULTS = {
  opacity: "1",
} satisfies DynamicLogoImgStyleDefaults;
