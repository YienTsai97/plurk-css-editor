import type { StyleProps } from "../types";

export type DashboardPicsHideDefaults = Required<
  Pick<StyleProps, "height" | "overflow">
>;

/** 用途：頭像列顯示時的預設（不藏）。 */
export const DASHBOARD_PICS_VISIBLE_DEFAULTS = {
  height: "auto",
  overflow: "visible",
} satisfies DashboardPicsHideDefaults;

/** 用途：隱藏頭像列時寫入的值（保留上方加入好友／粉絲按鈕）。 */
export const DASHBOARD_PICS_HIDDEN_VALUES = {
  height: "0px",
  overflow: "hidden",
} as const;
