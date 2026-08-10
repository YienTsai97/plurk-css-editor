"use client";

import ColorPicker from "@/components/controllers/color-picker";
import { NumberSliderControl } from "@/components/controllers/number-slider-control";
import {
  editorMenuTriggerClassName,
  editorMenuTriggerStyle,
  EditorMenuSectionLabel,
  EditorMenuSubContent,
  EditorMenuSubTrigger,
  EditorMenuTriggerRow,
} from "@/components/editor/editor-context-menu";
import {
  RESPONSE_COUNT_NEW_STYLE_DEFAULTS,
  RESPONSE_COUNT_STYLE_DEFAULTS,
} from "@/store/styleManager/defaults";
import { useStyleProp } from "@/store/styleManager/styleManager";
import { cssValueToString } from "@/store/styleManager/utils/cssValue";
import { ContextMenuSub } from "@/components/ui/context-menu";
import {
  RESPONSE_COUNT_NEW_SELECTOR,
  RESPONSE_COUNT_SELECTOR,
} from "./response-count.constants";

/** 用途：把 store 裡可能是 `0` / `0%` / 匯入值的 borderRadius 轉成 slider 可顯示的百分比數字。 */
const parseRadiusPercent = (value: unknown) => {
  const text = cssValueToString(value).trim();
  const match = text.match(/^(\d+(?:\.\d+)?)/);
  return Number(match?.[1] ?? 0);
};

/** 用途：貼文 context menu 內的「回應數徽章」子選單，提供已讀／未讀徽章顏色與共通圓角設定。 */
export const ResponseCountMenu = () => {
  /** 用途：已讀 selector 的可編輯狀態，包含共通圓角。 */
  const bgColor = useStyleProp(RESPONSE_COUNT_SELECTOR, "backgroundColor");
  const color = useStyleProp(RESPONSE_COUNT_SELECTOR, "color");
  const borderRadius = useStyleProp(RESPONSE_COUNT_SELECTOR, "borderRadius");

  /** 用途：未讀 selector 的可編輯狀態，只覆寫未讀專屬顏色。 */
  const newBgColor = useStyleProp(RESPONSE_COUNT_NEW_SELECTOR, "backgroundColor");
  const newColor = useStyleProp(RESPONSE_COUNT_NEW_SELECTOR, "color");

  return (
    <ContextMenuSub>
      <EditorMenuSubTrigger>回應數徽章（全域）</EditorMenuSubTrigger>
      <EditorMenuSubContent style={{ minWidth: 250 }}>
        {/* 用途：已讀與未讀共用的基礎徽章外觀。 */}
        <EditorMenuSectionLabel>共通</EditorMenuSectionLabel>
        <NumberSliderControl
          label="圓角"
          value={parseRadiusPercent(borderRadius.value)}
          min={0}
          max={50}
          step={1}
          unit="%"
          onChange={(value) => borderRadius.set(`${value}%`)}
          style={{ padding: "0 4px" }}
        />

        {/* 用途：一般/已讀回應數徽章的顏色設定。 */}
        <EditorMenuSectionLabel>已讀</EditorMenuSectionLabel>
        <ColorPicker
          value={cssValueToString(bgColor.value)}
          onChange={(v) => bgColor.set(v)}
          defaultValue={RESPONSE_COUNT_STYLE_DEFAULTS.backgroundColor}
          showReset
          trigger={<EditorMenuTriggerRow label="背景色" actionLabel="Select Color" />}
          triggerClassName={editorMenuTriggerClassName}
          triggerStyle={editorMenuTriggerStyle}
        />
        <ColorPicker
          value={cssValueToString(color.value)}
          onChange={(v) => color.set(v)}
          defaultValue={RESPONSE_COUNT_STYLE_DEFAULTS.color}
          showReset
          trigger={<EditorMenuTriggerRow label="文字色" actionLabel="Select Color" />}
          triggerClassName={editorMenuTriggerClassName}
          triggerStyle={editorMenuTriggerStyle}
        />

        {/* 用途：未讀回應數徽章只覆寫有 `.new` 狀態的顏色。 */}
        <EditorMenuSectionLabel>未讀</EditorMenuSectionLabel>
        <ColorPicker
          value={cssValueToString(newBgColor.value)}
          onChange={(v) => newBgColor.set(v)}
          defaultValue={RESPONSE_COUNT_NEW_STYLE_DEFAULTS.backgroundColor}
          showReset
          trigger={<EditorMenuTriggerRow label="背景色" actionLabel="Select Color" />}
          triggerClassName={editorMenuTriggerClassName}
          triggerStyle={editorMenuTriggerStyle}
        />
        <ColorPicker
          value={cssValueToString(newColor.value)}
          onChange={(v) => newColor.set(v)}
          defaultValue={RESPONSE_COUNT_NEW_STYLE_DEFAULTS.color}
          showReset
          trigger={<EditorMenuTriggerRow label="文字色" actionLabel="Select Color" />}
          triggerClassName={editorMenuTriggerClassName}
          triggerStyle={editorMenuTriggerStyle}
        />
      </EditorMenuSubContent>
    </ContextMenuSub>
  );
};
