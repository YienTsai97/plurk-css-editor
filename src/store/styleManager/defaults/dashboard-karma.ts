import type { StyleProps } from "../types";

/** 用途：Karma 數字預設不強制透明（沿用 .karma_red）。 */
export const DASHBOARD_KARMA_STYLE_DEFAULTS = {
  color: "inherit",
} satisfies Required<Pick<StyleProps, "color">>;

/** 用途：統計表 td 預設字級（對齊既有 15px）。 */
export const DASHBOARD_KARMA_STATS_TD_STYLE_DEFAULTS = {
  fontSize: "15px",
} satisfies Required<Pick<StyleProps, "fontSize">>;

export const DASHBOARD_KARMA_HIDDEN_COLOR = "transparent";
export const DASHBOARD_KARMA_STATS_HIDDEN_FONT_SIZE = "0";
