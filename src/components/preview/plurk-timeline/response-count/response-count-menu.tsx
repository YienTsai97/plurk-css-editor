"use client";

import ColorPicker from "@/components/controllers/color-picker";
import {
  editorMenuTriggerClassName,
  editorMenuTriggerStyle,
  EditorMenuRow,
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
import type { CSSProperties } from "react";
import {
  RESPONSE_COUNT_NEW_SELECTOR,
  RESPONSE_COUNT_SELECTOR,
} from "./response-count.constants";

/** 用途：共通圓角目前只支援 px 數值，這裡定義右側 number input 的外觀。 */
const numberInputStyle: CSSProperties = {
  width: 64,
  border: "1px solid #d1d5db",
  borderRadius: 4,
  padding: "4px 6px",
  fontSize: 12,
};

/** 用途：把 store 裡可能是 `0` / `0px` / 匯入值的 borderRadius 轉成 input 可顯示的數字。 */
const parseRadiusInput = (value: unknown) => {
  const text = cssValueToString(value).trim();
  const match = text.match(/^(\d+(?:\.\d+)?)/);
  return match?.[1] ?? "0";
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
        <EditorMenuRow label="圓角">
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <input
              type="number"
              min="0"
              step="1"
              value={parseRadiusInput(borderRadius.value)}
              onChange={(event) => {
                const value = event.target.value;
                borderRadius.set(value === "" ? "0" : `${value}px`);
              }}
              style={numberInputStyle}
            />
            <span style={{ fontSize: 12, color: "#6b7280" }}>px</span>
          </div>
        </EditorMenuRow>

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
