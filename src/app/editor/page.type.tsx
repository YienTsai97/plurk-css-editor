import type { StyleProps } from "@/store/styleManager/types";

/** 編輯器河道背景預覽：與 `StyleKey` 對齊，供 #background_layout 預覽一致。 */
export type EditorPageStyleProps = Required<
  Pick<
    StyleProps,
    | "backgroundImage"
    | "backgroundSize"
    | "backgroundRepeat"
    | "backgroundPosition"
    | "backgroundAttachment"
  >
>;
