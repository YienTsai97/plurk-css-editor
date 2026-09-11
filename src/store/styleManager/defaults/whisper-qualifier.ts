import type { StyleProps } from "../types";

export type WhisperQualifierStyleDefaults = Required<
  Pick<StyleProps, "backgroundColor">
>;

/** 用途：偷偷說 qualifier 背景色的 store 預設。 */
export const WHISPER_QUALIFIER_STYLE_DEFAULTS = {
  backgroundColor: "#32007e",
} satisfies WhisperQualifierStyleDefaults;
