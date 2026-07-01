import type { StyleProps } from "../types";

/** 回應數徽章（已讀）：對應 Plurk 選擇器 `.timeline-cnt .response_count`。 */
export type ResponseCountStyleDefaults = Required<
  Pick<StyleProps, "backgroundColor" | "color" | "borderRadius">
>;

/** 未讀回應數徽章：對應 Plurk 選擇器 `.timeline-cnt .new .response_count`。 */
export type ResponseCountNewStyleDefaults = Required<
  Pick<StyleProps, "backgroundColor" | "color">
>;

/** 用途：已讀回應數徽章的 store 初始值；borderRadius 設為 0，讓預覽一開始呈正方形。 */
export const RESPONSE_COUNT_STYLE_DEFAULTS = {
  backgroundColor: "rgba(255, 87, 77, 1)",
  color: "rgba(255, 255, 255, 1)",
  borderRadius: "0",
} satisfies ResponseCountStyleDefaults;

/** 用途：未讀回應數徽章的 store 初始值，只保留會覆寫 `.response_count` 的顏色。 */
export const RESPONSE_COUNT_NEW_STYLE_DEFAULTS = {
  backgroundColor: "rgba(229, 62, 62, 1)",
  color: "rgba(255, 255, 255, 1)",
} satisfies ResponseCountNewStyleDefaults;
