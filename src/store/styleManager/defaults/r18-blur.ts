import type { StyleProps } from "../types";

export type R18BlurStyleDefaults = Required<Pick<StyleProps, "filter">>;

/** 用途：R18 未展開內文模糊的 store 預設；0px 為無效果基線，之後改動才會記成 manual。 */
export const R18_BLUR_STYLE_DEFAULTS = {
  filter: "blur(0px)",
} satisfies R18BlurStyleDefaults;
