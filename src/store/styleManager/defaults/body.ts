import type { StyleProps } from "../types";

export type BodyStyleDefaults = Required<
  Pick<
    StyleProps,
    | "backgroundImage"
    | "backgroundSize"
    | "backgroundRepeat"
    | "backgroundPosition"
    | "backgroundAttachment"
  >
>;

export const BODY_STYLE_DEFAULTS = {
  backgroundImage: "none",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
  backgroundAttachment: "scroll",
} satisfies BodyStyleDefaults;
