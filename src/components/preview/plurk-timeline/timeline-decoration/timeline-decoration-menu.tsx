"use client";

import { NumberSliderControl } from "@/components/controllers/number-slider-control";
import {
  EditorMenuFieldLabel,
  EditorMenuItem,
  EditorMenuSubContent,
  EditorMenuSubTrigger,
  EditorMenuTitle,
} from "@/components/editor/editor-context-menu";
import { ContextMenuSub } from "@/components/ui/context-menu";
import { TIMELINE_DECORATION_STYLE_DEFAULTS } from "@/store/styleManager/defaults";
import { useStyleProp } from "@/store/styleManager/styleManager";
import { cssValueToString } from "@/store/styleManager/utils/cssValue";
import type { CssValue } from "@/types/css.type";
import type { CSSProperties, ChangeEvent, KeyboardEvent, MouseEvent, PointerEvent } from "react";
import { TIMELINE_DECORATION_SELECTOR } from "./timeline-decoration.constants";
import {
  hasDecorationImage,
  parseBackgroundSizePx,
} from "./timeline-decoration.utils";

const REPEAT_OPTIONS = [
  { value: "repeat-x", label: "水平重複" },
  { value: "repeat-y", label: "垂直重複" },
  { value: "repeat", label: "填滿" },
  { value: "no-repeat", label: "不重複" },
] as const;

const POSITION_OPTIONS = [
  { value: "bottom", label: "底部" },
  { value: "top", label: "頂部" },
  { value: "center", label: "置中" },
  { value: "left", label: "左側" },
  { value: "right", label: "右側" },
] as const;

const selectStyle: CSSProperties = {
  width: "100%",
  border: "1px solid #e5e7eb",
  padding: "6px 8px",
  fontSize: 12,
  borderRadius: 6,
  backgroundColor: "#ffffff",
  color: "#374151",
};

const fieldStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 0,
  padding: "0 4px",
};

type TimelineDecorationMenuProps = {
  onOpenDecorationDialog: () => void;
};

/** 用途：避免在 context menu 內操作 native select 時關閉選單。 */
const keepMenuOpen = {
  onPointerDown: (event: PointerEvent<HTMLSelectElement>) => event.stopPropagation(),
  onClick: (event: MouseEvent<HTMLSelectElement>) => event.stopPropagation(),
  onKeyDown: (event: KeyboardEvent<HTMLSelectElement>) => event.stopPropagation(),
};

/**
 * 用途：河道右鍵選單內的時間軸裝飾入口。
 * 「更換裝飾圖」常駐；「裝飾圖設定」僅在已有背景圖時可點選。
 */
export const TimelineDecorationMenu = ({
  onOpenDecorationDialog,
}: TimelineDecorationMenuProps) => {
  const backgroundImage = useStyleProp(TIMELINE_DECORATION_SELECTOR, "backgroundImage");
  const backgroundSize = useStyleProp(TIMELINE_DECORATION_SELECTOR, "backgroundSize");
  const backgroundRepeat = useStyleProp(TIMELINE_DECORATION_SELECTOR, "backgroundRepeat");
  const backgroundPosition = useStyleProp(TIMELINE_DECORATION_SELECTOR, "backgroundPosition");

  const showSettings = hasDecorationImage(backgroundImage.value as CssValue);
  const sizePx = parseBackgroundSizePx(
    backgroundSize.value ?? TIMELINE_DECORATION_STYLE_DEFAULTS.backgroundSize,
  );
  const repeatValue =
    cssValueToString(backgroundRepeat.value) ||
    TIMELINE_DECORATION_STYLE_DEFAULTS.backgroundRepeat;
  const positionValue =
    cssValueToString(backgroundPosition.value) ||
    TIMELINE_DECORATION_STYLE_DEFAULTS.backgroundPosition;

  const onRepeatChange = (event: ChangeEvent<HTMLSelectElement>) => {
    backgroundRepeat.set(event.target.value);
  };
  const onPositionChange = (event: ChangeEvent<HTMLSelectElement>) => {
    backgroundPosition.set(event.target.value);
  };

  return (
    <>
      <EditorMenuTitle>時間軸</EditorMenuTitle>
      <EditorMenuItem onSelect={onOpenDecorationDialog}>更換裝飾圖</EditorMenuItem>


      <ContextMenuSub>
        <EditorMenuSubTrigger
          disabled={!showSettings}
        >裝飾圖設定
        </EditorMenuSubTrigger>
        <EditorMenuSubContent style={{ minWidth: 250 }}>
          <NumberSliderControl
            label="大小"
            value={sizePx}
            min={10}
            max={200}
            step={1}
            unit="px"
            onChange={(value) => backgroundSize.set(`${value}px`)}
          />

          <div style={fieldStyle}>
            <EditorMenuFieldLabel>重複 - 排列方向</EditorMenuFieldLabel>
            <select
              value={repeatValue}
              onChange={onRepeatChange}
              style={selectStyle}
              {...keepMenuOpen}
            >
              {REPEAT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div style={fieldStyle}>
            <EditorMenuFieldLabel>位置</EditorMenuFieldLabel>
            <select
              value={positionValue}
              onChange={onPositionChange}
              style={selectStyle}
              {...keepMenuOpen}
            >
              {POSITION_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </EditorMenuSubContent>
      </ContextMenuSub >

    </>
  );
};
