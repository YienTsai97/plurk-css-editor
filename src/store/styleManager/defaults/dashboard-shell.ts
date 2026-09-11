import type { StyleProps } from "../types";

export type DashboardShellStyleDefaults = Required<
  Pick<
    StyleProps,
    | "opacity"
    | "backgroundColor"
    | "transition"
    | "border"
    | "borderRadius"
    | "padding"
  >
>;

/**
 * 用途：主控台外殼預設——平常／hover 皆不透明；背景預設 transparent。
 * transition 對齊常見皮膚 opacity 0.6s；邊框／內距對齊外殼無樣式起點。
 */
export const DASHBOARD_SHELL_STYLE_DEFAULTS = {
  opacity: "1",
  backgroundColor: "transparent",
  transition: "opacity 0.6s",
  border: "none",
  borderRadius: "0px",
  padding: "0px",
} satisfies DashboardShellStyleDefaults;

/** 用途：主控台外殼 hover（滑鼠停留）透明度預設。 */
export const DASHBOARD_SHELL_HOVER_STYLE_DEFAULTS = {
  opacity: "1",
} satisfies Required<Pick<StyleProps, "opacity">>;
