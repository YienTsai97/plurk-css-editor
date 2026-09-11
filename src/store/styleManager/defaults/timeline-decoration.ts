import type { StyleProps } from "../types";

export type TimelineDecorationStyleDefaults = Required<
  Pick<
    StyleProps,
    | "backgroundImage"
    | "backgroundSize"
    | "backgroundRepeat"
    | "backgroundPosition"
  >
>;

/** 用途：時間軸裝飾（._lc_ .timeline-bg）預設，對齊 Plurk stub（非河道 cover/center）。 */
export const TIMELINE_DECORATION_STYLE_DEFAULTS = {
  backgroundImage: "none",
  backgroundSize: "50px",
  backgroundRepeat: "repeat-x",
  backgroundPosition: "bottom",
} satisfies TimelineDecorationStyleDefaults;
