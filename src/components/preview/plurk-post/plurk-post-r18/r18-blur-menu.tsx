"use client";

import { NumberSliderControl } from "@/components/controllers/number-slider-control";
import {
  EditorMenuSectionLabel,
  EditorMenuSubContent,
  EditorMenuSubTrigger,
} from "@/components/editor/editor-context-menu";
import { ContextMenuSub } from "@/components/ui/context-menu";
import { R18_BLUR_STYLE_DEFAULTS } from "@/store/styleManager/defaults";
import { useStyleProp } from "@/store/styleManager/styleManager";
import { cssValueToString } from "@/store/styleManager/utils/cssValue";
import { R18_BLUR_SELECTOR } from "./r18-blur.constants";

/** 用途：把 store 裡的 filter: blur(Npx) 轉成滑桿數字。 */
const parseBlurPx = (value: unknown) => {
  const text = cssValueToString(value).trim();
  const match = text.match(/blur\(\s*(\d+(?:\.\d+)?)\s*px\s*\)/i);
  if (match) return Number(match[1]);
  const fallback = cssValueToString(R18_BLUR_STYLE_DEFAULTS.filter);
  const fallbackMatch = fallback.match(/blur\(\s*(\d+(?:\.\d+)?)\s*px\s*\)/i);
  return Number(fallbackMatch?.[1] ?? 0);
};

/** 用途：貼文右鍵「R18」子選單，提供未展開內文模糊程度滑桿。 */
export const R18BlurMenu = () => {
  const filter = useStyleProp(R18_BLUR_SELECTOR, "filter");

  return (
    <ContextMenuSub>
      <EditorMenuSubTrigger><strong>R18</strong></EditorMenuSubTrigger>
      <EditorMenuSubContent style={{ minWidth: 220 }}>
        <EditorMenuSectionLabel>未展開內文</EditorMenuSectionLabel>
        <NumberSliderControl
          label="模糊"
          value={parseBlurPx(filter.value)}
          min={0}
          max={20}
          step={0.5}
          unit="px"
          onChange={(value) => filter.set(`blur(${value}px)`)}
        />
      </EditorMenuSubContent>
    </ContextMenuSub>
  );
};
