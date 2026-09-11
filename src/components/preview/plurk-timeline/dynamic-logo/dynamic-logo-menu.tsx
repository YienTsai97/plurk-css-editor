"use client";

import { NumberSliderControl } from "@/components/controllers/number-slider-control";
import {
  EditorMenuFieldLabel,
  EditorMenuItem,
  EditorMenuTitle,
} from "@/components/editor/editor-context-menu";
import {
  useState,
  type CSSProperties,
  type ChangeEvent,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
} from "react";
import {
  DYNAMIC_LOGO_POSITION_STEP_PX,
  DYNAMIC_LOGO_SCALE_MAX,
  DYNAMIC_LOGO_SCALE_MIN,
  LOGO_CORNER_LABELS,
  type LogoCorner,
} from "./dynamic-logo.constants";
import { useLogoHoldNudge } from "./dynamic-logo-hold-nudge";

const fieldStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 0,
  padding: "0 4px",
};

const inputStyle: CSSProperties = {
  width: 64,
  border: "1px solid #e5e7eb",
  padding: "4px 6px",
  fontSize: 12,
  borderRadius: 6,
  backgroundColor: "#ffffff",
  color: "#374151",
};

const nudgeButtonStyle: CSSProperties = {
  width: 32,
  height: 32,
  border: "1px solid #e5e7eb",
  borderRadius: 6,
  backgroundColor: "#ffffff",
  color: "#374151",
  fontSize: 12,
  cursor: "pointer",
};

const cornerButtonStyle: CSSProperties = {
  ...nudgeButtonStyle,
  fontSize: 10,
  lineHeight: 1.1,
  padding: 0,
};

/** 用途：避免在 context menu 內操作 input／按鈕時關閉選單。 */
const keepMenuOpenProps = {
  onPointerDown: (event: PointerEvent<HTMLElement>) => event.stopPropagation(),
  onKeyDown: (event: KeyboardEvent<HTMLElement>) => event.stopPropagation(),
};

/**
 * 用途：聚焦時用本地 draft 字串編輯，避免每鍵立刻 commit／clamp 導致輸入被打斷。
 * blur／Enter 才解析並回寫 parent；未聚焦時顯示跟隨 prop。
 */
const useCommittedNumberDraft = (
  committed: number,
  onCommit: (value: number) => void,
) => {
  const [focused, setFocused] = useState(false);
  const [draft, setDraft] = useState(() => String(committed));

  const commitDraft = () => {
    const trimmed = draft.trim();
    if (trimmed === "") return;
    const next = Number(trimmed);
    if (!Number.isFinite(next)) return;
    onCommit(next);
  };

  return {
    value: focused ? draft : String(committed),
    onFocus: () => {
      setFocused(true);
      setDraft(String(committed));
    },
    onChange: (event: ChangeEvent<HTMLInputElement>) => {
      setDraft(event.target.value);
    },
    onBlur: () => {
      commitDraft();
      setFocused(false);
    },
    onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => {
      keepMenuOpenProps.onKeyDown(event);
      if (event.key === "Enter") {
        event.currentTarget.blur();
      }
    },
  };
};

export type DynamicLogoMenuProps = {
  hasImage: boolean;
  scalePercent: number;
  offsetX: number;
  offsetY: number;
  onOpenUploadDialog: () => void;
  onScalePercentChange: (value: number) => void;
  onOffsetXChange: (value: number) => void;
  onOffsetYChange: (value: number) => void;
  /** 用途：螢幕方向微調（dx>0 右、dy>0 下），從目前角落累加。 */
  onNudge: (dx: number, dy: number) => void;
  onCornerPreset: (corner: LogoCorner) => void;
  onReset: () => void;
};

/**
 * 用途：噗寶右鍵選單內容。
 * 上傳／大小／位置／重置皆在主層；無圖時大小與位置 disabled。
 * 四角為定位預設；中央十字為方向微調。
 */
export const DynamicLogoMenu = ({
  hasImage,
  scalePercent,
  offsetX,
  offsetY,
  onOpenUploadDialog,
  onScalePercentChange,
  onOffsetXChange,
  onOffsetYChange,
  onNudge,
  onCornerPreset,
  onReset,
}: DynamicLogoMenuProps) => {
  const controlsDisabled = !hasImage;
  const scaleDraft = useCommittedNumberDraft(scalePercent, onScalePercentChange);
  const offsetXDraft = useCommittedNumberDraft(offsetX, onOffsetXChange);
  const offsetYDraft = useCommittedNumberDraft(offsetY, onOffsetYChange);
  const arrowHoldProps = useLogoHoldNudge(onNudge);

  const press =
    (apply: () => void) => (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();
      apply();
    };

  const cornerButton = (corner: LogoCorner) => (
    <button
      type="button"
      disabled={controlsDisabled}
      style={cornerButtonStyle}
      aria-label={LOGO_CORNER_LABELS[corner]}
      title={LOGO_CORNER_LABELS[corner]}
      {...keepMenuOpenProps}
      onClick={press(() => onCornerPreset(corner))}
    >
      {LOGO_CORNER_LABELS[corner]}
    </button>
  );

  const arrowButton = (
    dx: number,
    dy: number,
    label: string,
    glyph: string,
  ) => (
    <button
      type="button"
      disabled={controlsDisabled}
      style={nudgeButtonStyle}
      aria-label={label}
      {...keepMenuOpenProps}
      {...arrowHoldProps(dx, dy)}
    >
      {glyph}
    </button>
  );

  return (
    <>
      <EditorMenuTitle>噗寶自定義</EditorMenuTitle>

      <EditorMenuItem onSelect={onOpenUploadDialog}>上傳圖片</EditorMenuItem>

      <div
        style={{
          ...fieldStyle,
          opacity: controlsDisabled ? 0.45 : 1,
          pointerEvents: controlsDisabled ? "none" : "auto",
          padding: "8px 12px",
        }}
        aria-disabled={controlsDisabled}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <NumberSliderControl
              label="調整圖片大小"
              value={scalePercent}
              min={DYNAMIC_LOGO_SCALE_MIN}
              max={DYNAMIC_LOGO_SCALE_MAX}
              step={1}
              unit="%"
              showValue={false}
              disabled={controlsDisabled}
              onChange={onScalePercentChange}
              style={{ paddingLeft: 0, paddingRight: 0 }}
            />
          </div>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              marginTop: 2,
              fontSize: 12,
              color: "#6b7280",
            }}
          >
            <input
              type="number"
              min={DYNAMIC_LOGO_SCALE_MIN}
              max={DYNAMIC_LOGO_SCALE_MAX}
              step={1}
              value={scaleDraft.value}
              disabled={controlsDisabled}
              onFocus={scaleDraft.onFocus}
              onChange={scaleDraft.onChange}
              onBlur={scaleDraft.onBlur}
              onKeyDown={scaleDraft.onKeyDown}
              style={inputStyle}
              onPointerDown={keepMenuOpenProps.onPointerDown}
              onClick={(event) => event.stopPropagation()}
            />
            %
          </label>
        </div>
      </div>

      <div
        style={{
          ...fieldStyle,
          opacity: controlsDisabled ? 0.45 : 1,
          pointerEvents: controlsDisabled ? "none" : "auto",
          padding: "8px 12px",
        }}
        aria-disabled={controlsDisabled}
      >
        <EditorMenuFieldLabel>調整圖片位置</EditorMenuFieldLabel>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 8 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "32px 32px 32px",
              gridTemplateRows: "28px 28px 28px",
              gap: 4,
              justifyContent: "center",
              marginBottom: 8,
            }}
          >
            {cornerButton("top-left")}
            {arrowButton(0, -DYNAMIC_LOGO_POSITION_STEP_PX, "向上", "↑")}
            {cornerButton("top-right")}
            {arrowButton(-DYNAMIC_LOGO_POSITION_STEP_PX, 0, "向左", "←")}
            <span />
            {arrowButton(DYNAMIC_LOGO_POSITION_STEP_PX, 0, "向右", "→")}
            {cornerButton("bottom-left")}
            {arrowButton(0, DYNAMIC_LOGO_POSITION_STEP_PX, "向下", "↓")}
            {cornerButton("bottom-right")}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
            <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
              <span style={{ color: "#6b7280", minWidth: 14 }}>X</span>
              <input
                type="number"
                step={1}
                value={offsetXDraft.value}
                disabled={controlsDisabled}
                onFocus={offsetXDraft.onFocus}
                onChange={offsetXDraft.onChange}
                onBlur={offsetXDraft.onBlur}
                onKeyDown={offsetXDraft.onKeyDown}
                style={inputStyle}
                onPointerDown={keepMenuOpenProps.onPointerDown}
                onClick={(event) => event.stopPropagation()}
              />
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
              <span style={{ color: "#6b7280", minWidth: 14 }}>Y</span>
              <input
                type="number"
                step={1}
                value={offsetYDraft.value}
                disabled={controlsDisabled}
                onFocus={offsetYDraft.onFocus}
                onChange={offsetYDraft.onChange}
                onBlur={offsetYDraft.onBlur}
                onKeyDown={offsetYDraft.onKeyDown}
                style={inputStyle}
                onPointerDown={keepMenuOpenProps.onPointerDown}
                onClick={(event) => event.stopPropagation()}
              />
            </label>
          </div>
        </div>
      </div>

      <EditorMenuItem onSelect={onReset}>重置</EditorMenuItem>
    </>
  );
};
