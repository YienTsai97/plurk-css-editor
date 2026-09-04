"use client";

import BorderEditor from "@/components/controllers/border-editor";
import ColorPicker from "@/components/controllers/color-picker";
import {
  editorMenuTriggerClassName,
  EditorMenuTriggerRow,
  editorMenuTriggerStyle
} from "@/components/editor/editor-context-menu";
import { PLURK_POST_STYLE_DEFAULTS } from "@/store/styleManager/defaults";
import { useStyleProp } from "@/store/styleManager/styleManager";
import { cssValueToString } from "@/store/styleManager/utils/cssValue";
import { PLURK_POST_SELECTOR } from "./plurk-post-appearance.constants";

/** 用途：貼文外觀 feature 的右鍵選單內容，自己讀寫 `.plurk_cnt` 的 store 狀態。 */
export const PlurkPostAppearanceMenu = () => {
  const bgColor = useStyleProp(PLURK_POST_SELECTOR, "backgroundColor");
  const border = useStyleProp(PLURK_POST_SELECTOR, "border");
  const bgColorValue =
    cssValueToString(bgColor.value) || PLURK_POST_STYLE_DEFAULTS.backgroundColor;
  const bgColorDefaultValue =
    cssValueToString(bgColor.initial) || PLURK_POST_STYLE_DEFAULTS.backgroundColor;

  return (
    <>
      {/* 用途：貼文本體 `.plurk_cnt` 的外觀設定。 */}
      {/* <EditorMenuSectionLabel>貼文外觀</EditorMenuSectionLabel> */}
      <ColorPicker
        value={bgColorValue}
        onChange={(v) => bgColor.set(v)}
        defaultValue={bgColorDefaultValue}
        showReset
        trigger={<EditorMenuTriggerRow label="背景色" actionLabel="" />}
        triggerClassName={editorMenuTriggerClassName}
        triggerStyle={editorMenuTriggerStyle}
      />
      <BorderEditor
        borderValue={border.value}
        setChange={border.set}
        trigger={<EditorMenuTriggerRow label="邊框" actionLabel="" />}
        triggerClassName={editorMenuTriggerClassName}
        triggerStyle={editorMenuTriggerStyle}
      />
    </>
  );
};
