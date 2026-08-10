"use client"
import { CssValue } from "@/types/css.type";
import { normalizeBorder } from "@/utils/border";
import * as Popover from "@radix-ui/react-popover";
import type { CSSProperties, ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import ColorPicker from "./color-picker";
import { NumberSliderControl } from "./number-slider-control";

type Prop = {
  borderValue: CssValue | undefined;
  setChange: (v: CssValue) => void;
  /** 用途：讓 context menu 可傳入整排 trigger；未傳時維持原本的 Set Border 按鈕。 */
  trigger?: ReactNode;
  triggerStyle?: CSSProperties;
  triggerClassName?: string;
}

// 解析邊框字串，分離數值和單位
const parseBorderValue = (input: string) => {
  const match = input.match(/^(\d+(?:\.\d+)?)(px|em|rem|vh|vw|%)?$/);
  if (match) {
    return {
      value: parseFloat(match[1]),
      unit: match[2] || 'px'
    };
  }
  return { value: 0, unit: 'px' };
};

const parseBorderParts = (input: string) => {
  const match = input.match(/^(\S+)\s+(\S+)\s+(.+)$/);
  if (!match) return null;

  return {
    width: match[1],
    style: match[2],
    color: match[3],
  };
};

/** 用途：邊框寬度不同單位需要不同 slider 範圍，避免 px 太小或 % 太大時不好調。 */
const getBorderWidthSliderConfig = (unit: string) => {
  switch (unit) {
    case "%":
      return { max: 100, step: 1 };
    case "em":
    case "rem":
      return { max: 5, step: 0.1 };
    case "vh":
    case "vw":
      return { max: 20, step: 0.5 };
    case "px":
    default:
      return { max: 20, step: 1 };
  }
};

const formatSliderNumber = (value: number, step: number) => {
  const precision = step.toString().split(".")[1]?.length ?? 0;
  return value.toFixed(precision).replace(/\.0+$/, "");
};

const isTransparentColor = (input: string) => {
  const value = input.trim().toLowerCase();
  return value === "" || value === "transparent" || /^rgba\([^)]*,\s*0\s*\)$/.test(value);
};

const BorderEditor = ({
  borderValue,
  setChange,
  trigger = "Set Border",
  triggerStyle,
  triggerClassName,
}: Prop) => {
  const [width, setWidth] = useState<string>("");
  const [style, setStyle] = useState<string>("");
  const [color, setColor] = useState<string>("rgba(0, 0, 0, 1)");
  const [unit, setUnit] = useState<string>("px");
  const widthSlider = getBorderWidthSliderConfig(unit);
  const widthNumber = Number(width) || 0;

  const toHexLabel = (input: string) => {
    const value = input.trim().toLowerCase();
    if (value === "transparent") {
      return { label: "透明", hex: "#000000", isTransparent: true };
    }

    const rgbaMatch = value.match(/^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(0|1|0?\.\d+)\s*\)$/);
    if (rgbaMatch) {
      const r = Math.max(0, Math.min(255, Number(rgbaMatch[1])));
      const g = Math.max(0, Math.min(255, Number(rgbaMatch[2])));
      const b = Math.max(0, Math.min(255, Number(rgbaMatch[3])));
      const a = Number(rgbaMatch[4]);
      const hex = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`.toUpperCase();
      if (a === 0) {
        return { label: "透明", hex, isTransparent: true };
      }
      return { label: hex, hex, isTransparent: false };
    }

    const rgbMatch = value.match(/^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/);
    if (rgbMatch) {
      const r = Math.max(0, Math.min(255, Number(rgbMatch[1])));
      const g = Math.max(0, Math.min(255, Number(rgbMatch[2])));
      const b = Math.max(0, Math.min(255, Number(rgbMatch[3])));
      const hex = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`.toUpperCase();
      return { label: hex, hex, isTransparent: false };
    }

    const hexMatch = value.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
    if (hexMatch) {
      const hex = hexMatch[1];
      if (hex.length === 3) {
        const full = `#${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`.toUpperCase();
        return { label: full, hex: full, isTransparent: false };
      }
      const full = `#${hex}`.toUpperCase();
      return { label: full, hex: full, isTransparent: false };
    }

    return { label: input, hex: "#FFFFF", isTransparent: false };
  };

  // 當 borderValue 改變時，解析並更新內部狀態
  useEffect(() => {
    if (borderValue && typeof borderValue === 'string') {
      const result = normalizeBorder(borderValue);
      if (result.ok) {
        if (result.value === "none") {
          setWidth("0");
          setUnit("px");
          setStyle("none");
          setColor("rgba(0, 0, 0, 0)");
          return;
        }

        // 用途：border color 可能是 `rgba(0, 0, 0, 1)` 這種含空白字串，不能直接 split(" ")。
        const parts = parseBorderParts(result.value);
        if (parts) {
          const { width: w, style: s, color: c } = parts;
          const { value, unit: u } = parseBorderValue(w);
          setWidth(value.toString());
          setUnit(u);
          setStyle(s);
          setColor(c);
        }
      } else {
        // 如果解析失敗，設為 none
        setWidth("0");
        setUnit("px");
        setStyle("none");
        setColor("rgba(0, 0, 0, 0)");
      }
    }
  }, [borderValue]);

  /** 用途：切換單位時如果原本數值超過該單位 slider 上限，就自動收斂到可操作範圍內。 */
  useEffect(() => {
    if (!width) return;
    if (widthNumber > widthSlider.max) {
      setWidth(formatSliderNumber(widthSlider.max, widthSlider.step));
    }
  }, [width, widthNumber, widthSlider.max, widthSlider.step]);

  const composed = useMemo(() => {
    const w = width?.trim();
    const s = style?.trim();
    const c = color?.trim();
    if (!w || !s || !c) return "";
    if (Number(w) <= 0 || s === "none" || s === "hidden") return "none";
    return `${w}${unit} ${s} ${c}`;
  }, [width, style, color, unit]);

  // 即時預覽：內容有效就同步到樣式
  useEffect(() => {
    if (!composed) return;
    const result = normalizeBorder(composed);
    if (result.ok && result.value !== borderValue) {
      setChange(result.value);
    }
  }, [composed, borderValue, setChange]);

  const resetToNone = () => {
    setWidth("0");
    setUnit("px");
    setStyle("none");
    setColor("rgba(0, 0, 0, 0)");
    setChange("none");
  };

  const handleWidthChange = (value: number) => {
    setWidth(formatSliderNumber(value, widthSlider.step));

    // 用途：從 none 狀態重新拖出寬度時，自動補成可見邊框，否則 CSS 仍會被 border-style: none 吃掉。
    if (value > 0) {
      setStyle((currentStyle) => {
        if (!currentStyle || currentStyle === "none" || currentStyle === "hidden") {
          return "solid";
        }
        return currentStyle;
      });

      setColor((currentColor) => {
        if (isTransparentColor(currentColor)) {
          return "rgba(0, 0, 0, 1)";
        }
        return currentColor;
      });
    }
  };

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        {/* 用途：trigger 可被 editor menu 替換成整排可點列，同時保留 Popover 行為。 */}
        <button
          type="button"
          className={triggerClassName}
          style={{ fontSize: '12px', color: '#666', ...triggerStyle }}
        >
          {trigger}
        </button>
      </Popover.Trigger>
      <Popover.Content
        side="right"
        align="start"
        sideOffset={9}
        alignOffset={0}
        style={{
          padding: '16px',
          minWidth: '300px',
          backgroundColor: '#fff',
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.12)",
          zIndex: 1400
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <NumberSliderControl
              label="寬度"
              value={widthNumber}
              min={0}
              max={widthSlider.max}
              step={widthSlider.step}
              unit={"px"}//unit
              onChange={handleWidthChange}
            />
            {/* <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              style={{
                border: '1px solid #ddd',
                padding: '4px 8px',
                fontSize: '12px',
                borderRadius: '4px'
              }}
            >
              <option value="px">px</option>
              <option value="em">em</option>
              <option value="rem">rem</option>
              <option value="vh">vh</option>
              <option value="vw">vw</option>
              <option value="%">%</option>
            </select> */}
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <label style={{ fontSize: '12px', minWidth: '40px' }}>樣式:</label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              style={{
                border: '1px solid #ddd',
                padding: '4px 8px',
                fontSize: '12px',
                borderRadius: '4px',
                flex: 1
              }}
            >
              <option value="">選擇樣式</option>
              <option value="none">none</option>
              <option value="hidden">hidden</option>
              <option value="dotted">dotted</option>
              <option value="dashed">dashed</option>
              <option value="solid">solid</option>
              <option value="double">double</option>
              <option value="groove">groove</option>
              <option value="ridge">ridge</option>
              <option value="inset">inset</option>
              <option value="outset">outset</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <label style={{ fontSize: '12px', minWidth: '40px' }}>顏色:</label>
            <ColorPicker value={color} onChange={setColor} />
            {(() => {
              const meta = toHexLabel(color);
              return (
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#666" }}>
                  <span
                    style={{
                      width: "14px",
                      height: "14px",
                      borderRadius: "4px",
                      backgroundColor: meta.isTransparent ? "transparent" : meta.hex,
                      border: "1px solid #ddd"
                    }}
                  />
                  <span>{meta.label}</span>
                </span>
              );
            })()}
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            fontSize: '11px',
            color: '#666',
            padding: '8px',
            background: '#f5f5f5',
            borderRadius: '4px',
            fontFamily: 'monospace'
          }}>
            <span>預覽: {composed || "—"}</span>
            <button
              type="button"
              onClick={resetToNone}
              style={{
                fontSize: '11px',
                color: '#666',
                border: '1px solid #ddd',
                padding: '4px 8px',
                borderRadius: '4px',
                background: 'transparent'
              }}
            >
              重置為無
            </button>
          </div>
        </div>
      </Popover.Content>
    </Popover.Root>
  )
}

export default BorderEditor