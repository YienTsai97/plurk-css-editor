"use client";

import ColorPicker from "@/components/controllers/color-picker";
import {
  EditorMenuSectionLabel,
  EditorMenuSubContent,
  EditorMenuSubTrigger,
  editorMenuTriggerClassName,
  EditorMenuTriggerRow,
  editorMenuTriggerStyle,
} from "@/components/editor/editor-context-menu";
import { ContextMenuSub } from "@/components/ui/context-menu";
import { WHISPER_QUALIFIER_STYLE_DEFAULTS } from "@/store/styleManager/defaults";
import { useStyleProp } from "@/store/styleManager/styleManager";
import { cssValueToString } from "@/store/styleManager/utils/cssValue";
import { WHISPER_QUALIFIER_SELECTOR } from "./whisper-qualifier.constants";

/** 用途：貼文右鍵「偷偷說」子選單，提供 qualifier 背景色。 */
export const WhisperQualifierMenu = () => {
  const bgColor = useStyleProp(WHISPER_QUALIFIER_SELECTOR, "backgroundColor");
  const bgColorValue =
    cssValueToString(bgColor.value) ||
    WHISPER_QUALIFIER_STYLE_DEFAULTS.backgroundColor;

  return (
    <ContextMenuSub>
      <EditorMenuSubTrigger><strong>偷偷說</strong></EditorMenuSubTrigger>
      <EditorMenuSubContent style={{ minWidth: 220 }}>
        <EditorMenuSectionLabel>語氣詞</EditorMenuSectionLabel>
        <ColorPicker
          value={bgColorValue}
          onChange={(v) => bgColor.set(v)}
          defaultValue={WHISPER_QUALIFIER_STYLE_DEFAULTS.backgroundColor}
          showReset
          trigger={<EditorMenuTriggerRow label="背景色" actionLabel="" />}
          triggerClassName={editorMenuTriggerClassName}
          triggerStyle={editorMenuTriggerStyle}
        />
      </EditorMenuSubContent>
    </ContextMenuSub>
  );
};
