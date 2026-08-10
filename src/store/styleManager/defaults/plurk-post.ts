import type { StyleProps } from "../types";

export type PlurkPostStyleDefaults = Required<
  Pick<StyleProps, "backgroundColor" | "backgroundImage" | "border">
>;

export const PLURK_POST_STYLE_DEFAULTS = {
  backgroundColor: "rgba(255, 255, 255, 1)",
  backgroundImage: "none",
  border: "none",
} satisfies PlurkPostStyleDefaults;
