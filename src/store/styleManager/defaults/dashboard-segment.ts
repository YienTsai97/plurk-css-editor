import type { StyleProps } from "../types";

export type DashboardSegmentStyleDefaults = Required<
  Pick<
    StyleProps,
    "backgroundColor" | "border" | "padding" | "borderRadius" | "marginTop"
  >
>;

/** 用途：主控台各區塊白圓角卡片預設，對齊既有靜態 `.segment-content`。 */
export const DASHBOARD_SEGMENT_STYLE_DEFAULTS = {
  backgroundColor: "#FFF",
  border: "none",
  padding: "5px",
  borderRadius: "10px",
  marginTop: "10px",
} satisfies DashboardSegmentStyleDefaults;
