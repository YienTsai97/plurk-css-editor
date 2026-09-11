import type { StyleProps } from "../types";

export type MutedOpacityStyleDefaults = Required<Pick<StyleProps, "opacity">>;

/** 用途：消音噗透明度的 store 預設；1（100%）為無效果基線，之後改動才會記成 manual。 */
export const MUTED_OPACITY_STYLE_DEFAULTS = {
  opacity: "1",
} satisfies MutedOpacityStyleDefaults;
