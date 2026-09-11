"use client";

import BorderEditor from "@/components/controllers/border-editor";
import ColorPicker from "@/components/controllers/color-picker";
import { NumberSliderControl } from "@/components/controllers/number-slider-control";
import {
  EditorMenuSectionLabel,
  EditorMenuSubContent,
  EditorMenuSubTrigger,
  editorMenuTriggerClassName,
  EditorMenuTriggerRow,
  editorMenuTriggerStyle,
} from "@/components/editor/editor-context-menu";
import { ContextMenuSub } from "@/components/ui/context-menu";
import { DASHBOARD_SEGMENT_STYLE_DEFAULTS } from "@/store/styleManager/defaults";
import { useStyleProp } from "@/store/styleManager/styleManager";
import { cssValueToString } from "@/store/styleManager/utils/cssValue";
import { DASHBOARD_SEGMENT_SELECTOR } from "./dashboard-segment.constants";

/** 用途：把可能是 `10px`／數字的 CSS 長度轉成滑桿用 px。 */
const parsePx = (value: unknown, fallback: number) => {
  const text = cssValueToString(value).trim();
  const match = text.match(/^(\d+(?:\.\d+)?)/);
  if (match) return Number(match[1]);
  return fallback;
};

/** 用途：主控台右鍵「各區塊」子選單：白圓角卡片背景／邊框／圓角／padding／上邊距。 */
export const DashboardSegmentMenu = () => {
  const bgColor = useStyleProp(DASHBOARD_SEGMENT_SELECTOR, "backgroundColor");
  const border = useStyleProp(DASHBOARD_SEGMENT_SELECTOR, "border");
  const padding = useStyleProp(DASHBOARD_SEGMENT_SELECTOR, "padding");
  const borderRadius = useStyleProp(DASHBOARD_SEGMENT_SELECTOR, "borderRadius");
  const marginTop = useStyleProp(DASHBOARD_SEGMENT_SELECTOR, "marginTop");

  const bgColorValue =
    cssValueToString(bgColor.value) ||
    DASHBOARD_SEGMENT_STYLE_DEFAULTS.backgroundColor;

  return (
    <ContextMenuSub>
      <EditorMenuSubTrigger>各區塊</EditorMenuSubTrigger>
      <EditorMenuSubContent style={{ minWidth: 240 }}>
        <EditorMenuSectionLabel>外觀</EditorMenuSectionLabel>
        <ColorPicker
          value={bgColorValue}
          onChange={(v) => bgColor.set(v)}
          defaultValue={DASHBOARD_SEGMENT_STYLE_DEFAULTS.backgroundColor}
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
        <NumberSliderControl
          label="圓角"
          value={parsePx(borderRadius.value, 10)}
          min={0}
          max={40}
          step={1}
          unit="px"
          onChange={(value) => borderRadius.set(`${value}px`)}
        />
        <NumberSliderControl
          label="內距"
          value={parsePx(padding.value, 5)}
          min={0}
          max={40}
          step={1}
          unit="px"
          onChange={(value) => padding.set(`${value}px`)}
        />
        <NumberSliderControl
          label="上邊距"
          value={parsePx(marginTop.value, 10)}
          min={0}
          max={40}
          step={1}
          unit="px"
          onChange={(value) => marginTop.set(`${value}px`)}
        />
      </EditorMenuSubContent>
    </ContextMenuSub>
  );
};
