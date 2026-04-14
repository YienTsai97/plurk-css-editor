import type { StyleProps } from "@/store/styleManager/types";

/** 編輯器 body 背景相關：與 `StyleKey` 對齊，供預覽與匯出一致。 */
export type EditorPageStyleProps = Required<
  Pick<
    StyleProps,
    | "backgroundImage"
    | "backgroundSize"
    | "backgroundRepeat"
    | "backgroundPosition"
    | "backgroundAttachment"
  >
> & {
  backgroundImageChanged: boolean;
  backgroundSizeChanged: boolean;
  backgroundRepeatChanged: boolean;
};
