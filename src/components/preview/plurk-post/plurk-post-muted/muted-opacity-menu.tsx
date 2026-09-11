"use client";

import { NumberSliderControl } from "@/components/controllers/number-slider-control";
import {
  EditorMenuSectionLabel,
  EditorMenuSubContent,
  EditorMenuSubTrigger,
} from "@/components/editor/editor-context-menu";
import { ContextMenuSub } from "@/components/ui/context-menu";
import { MUTED_OPACITY_STYLE_DEFAULTS } from "@/store/styleManager/defaults";
import { useStyleProp } from "@/store/styleManager/styleManager";
import { cssValueToString } from "@/store/styleManager/utils/cssValue";
import { MUTED_OPACITY_SELECTOR } from "./muted-opacity.constants";

/** 用途：把 store opacity 轉成 0–100 百分比，方便滑桿操作。 */
const parseOpacityPercent = (value: unknown) => {
  const text = cssValueToString(value).trim();
  if (!text) {
    return Number(MUTED_OPACITY_STYLE_DEFAULTS.opacity) * 100;
  }
  const n = Number(text);
  if (!Number.isFinite(n)) {
    return Number(MUTED_OPACITY_STYLE_DEFAULTS.opacity) * 100;
  }
  return Math.round(n * 100);
};

/** 用途：貼文右鍵「消音」子選單，提供消音噗透明度滑桿。 */
export const MutedOpacityMenu = () => {
  const opacity = useStyleProp(MUTED_OPACITY_SELECTOR, "opacity");

  return (
    <ContextMenuSub>
      <EditorMenuSubTrigger><strong>消音</strong></EditorMenuSubTrigger>
      <EditorMenuSubContent style={{ minWidth: 220 }}>
        <EditorMenuSectionLabel>消音噗</EditorMenuSectionLabel>
        <NumberSliderControl
          label="透明度"
          value={parseOpacityPercent(opacity.value)}
          min={0}
          max={100}
          step={5}
          unit="%"
          onChange={(value) => opacity.set(String(value / 100))}
        />
      </EditorMenuSubContent>
    </ContextMenuSub>
  );
};
