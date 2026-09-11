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
import {
  DASHBOARD_SHELL_HOVER_STYLE_DEFAULTS,
  DASHBOARD_SHELL_STYLE_DEFAULTS,
} from "@/store/styleManager/defaults";
import { useStyleProp } from "@/store/styleManager/styleManager";
import { cssValueToString } from "@/store/styleManager/utils/cssValue";
import {
  DASHBOARD_SHELL_HOVER_SELECTOR,
  DASHBOARD_SHELL_SELECTOR,
} from "./dashboard-shell.constants";

/** 用途：把 store opacity 轉成 0–100 百分比。 */
const parseOpacityPercent = (value: unknown, fallback: string) => {
  const text = cssValueToString(value).trim();
  const raw = text || fallback;
  const n = Number(raw);
  if (!Number.isFinite(n)) return Math.round(Number(fallback) * 100);
  return Math.round(n * 100);
};

/** 用途：從 `opacity 0.6s` 之類字串取出秒數。 */
const parseTransitionSeconds = (value: unknown, fallback = 0.6) => {
  const text = cssValueToString(value).trim();
  const match = text.match(/(\d+(?:\.\d+)?)\s*s/i);
  if (match) return Number(match[1]);
  return fallback;
};

/** 用途：把可能是 `10px`／數字的 CSS 長度轉成滑桿用 px。 */
const parsePx = (value: unknown, fallback: number) => {
  const text = cssValueToString(value).trim();
  const match = text.match(/^(\d+(?:\.\d+)?)/);
  if (match) return Number(match[1]);
  return fallback;
};

/** 用途：主控台右鍵「主控台外殼」：透明度、動畫、背景色、邊框、內距。 */
export const DashboardShellMenu = () => {
  const opacity = useStyleProp(DASHBOARD_SHELL_SELECTOR, "opacity");
  const backgroundColor = useStyleProp(
    DASHBOARD_SHELL_SELECTOR,
    "backgroundColor",
  );
  const transition = useStyleProp(DASHBOARD_SHELL_SELECTOR, "transition");
  const border = useStyleProp(DASHBOARD_SHELL_SELECTOR, "border");
  const borderRadius = useStyleProp(DASHBOARD_SHELL_SELECTOR, "borderRadius");
  const padding = useStyleProp(DASHBOARD_SHELL_SELECTOR, "padding");
  const hoverOpacity = useStyleProp(DASHBOARD_SHELL_HOVER_SELECTOR, "opacity");

  const bgColorValue =
    cssValueToString(backgroundColor.value) ||
    DASHBOARD_SHELL_STYLE_DEFAULTS.backgroundColor;

  /**
   * 用途：改任一透明度時，把另一側 opacity 與 transition 標成 manual，
   * 避免匯出只輸出單側、漏掉 `:hover` 或 `transition`
   *（registered 預設不會進 getAllStyles）。
   * 剛寫入的一側直接用 nextValue，避免 React state 尚未更新讀到舊值。
   */
  const ensureOpacityPairExports = (
    side: "base" | "hover",
    nextValue: string,
  ) => {
    if (side === "base") {
      opacity.set(nextValue);
      const pairedHover =
        cssValueToString(hoverOpacity.value).trim() ||
        DASHBOARD_SHELL_HOVER_STYLE_DEFAULTS.opacity;
      hoverOpacity.set(pairedHover);
    } else {
      hoverOpacity.set(nextValue);
      const pairedBase =
        cssValueToString(opacity.value).trim() ||
        DASHBOARD_SHELL_STYLE_DEFAULTS.opacity;
      opacity.set(pairedBase);
    }

    const transitionValue =
      cssValueToString(transition.value).trim() ||
      DASHBOARD_SHELL_STYLE_DEFAULTS.transition;
    transition.set(transitionValue);
  };

  return (
    <ContextMenuSub>
      <EditorMenuSubTrigger>主控台外殼</EditorMenuSubTrigger>
      <EditorMenuSubContent style={{ minWidth: 240 }}>
        <EditorMenuSectionLabel>透明度</EditorMenuSectionLabel>
        <NumberSliderControl
          label="平常"
          value={parseOpacityPercent(
            opacity.value,
            DASHBOARD_SHELL_STYLE_DEFAULTS.opacity,
          )}
          min={0}
          max={100}
          step={5}
          unit="%"
          onChange={(value) => {
            ensureOpacityPairExports("base", String(value / 100));
          }}
        />
        <NumberSliderControl
          label="滑鼠停留"
          value={parseOpacityPercent(
            hoverOpacity.value,
            DASHBOARD_SHELL_HOVER_STYLE_DEFAULTS.opacity,
          )}
          min={0}
          max={100}
          step={5}
          unit="%"
          onChange={(value) => {
            ensureOpacityPairExports("hover", String(value / 100));
          }}
        />
        <NumberSliderControl
          label="透明度動畫"
          value={parseTransitionSeconds(transition.value, 0.6)}
          min={0}
          max={2}
          step={0.1}
          unit="s"
          onChange={(value) => transition.set(`opacity ${value}s`)}
        />

        <EditorMenuSectionLabel>外觀</EditorMenuSectionLabel>
        <ColorPicker
          value={bgColorValue}
          onChange={(v) => backgroundColor.set(v)}
          defaultValue={DASHBOARD_SHELL_STYLE_DEFAULTS.backgroundColor}
          showReset
          trigger={<EditorMenuTriggerRow label="背景色" actionLabel="" />}
          triggerClassName={editorMenuTriggerClassName}
          triggerStyle={editorMenuTriggerStyle}
        />
        <BorderEditor
          borderValue={border.value}
          setChange={border.set}
          borderRadiusValue={
            borderRadius.value ?? DASHBOARD_SHELL_STYLE_DEFAULTS.borderRadius
          }
          setBorderRadius={borderRadius.set}
          trigger={<EditorMenuTriggerRow label="邊框" actionLabel="" />}
          triggerClassName={editorMenuTriggerClassName}
          triggerStyle={editorMenuTriggerStyle}
        />
        <NumberSliderControl
          label="內距"
          value={parsePx(padding.value, 0)}
          min={0}
          max={40}
          step={1}
          unit="px"
          onChange={(value) => padding.set(`${value}px`)}
        />
      </EditorMenuSubContent>
    </ContextMenuSub>
  );
};
