"use client"
import { CssValue } from "@/types/css.type";
import { normalizeBorder } from "@/utils/border";
import * as Popover from "@radix-ui/react-popover";
import { useEffect, useMemo, useState } from "react";
import ColorPicker from "./color-picker";

type Prop = {
  borderValue: CssValue | undefined;
  setChange: (v: CssValue) => void;
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

const BorderEditor = ({ borderValue, setChange }: Prop) => {
  const [width, setWidth] = useState<string>("");
  const [style, setStyle] = useState<string>("");
  const [color, setColor] = useState<string>("rgba(0, 0, 0, 1)");
  const [unit, setUnit] = useState<string>("px");

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
        const parts = result.value.split(' ');
        if (parts.length === 3) {
          const [w, s, c] = parts;
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

  const composed = useMemo(() => {
    const w = width?.trim();
    const s = style?.trim();
    const c = color?.trim();
    if (!w || !s || !c) return "";
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

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button type="button" style={{ fontSize: '12px', color: '#666' }}>
          Set Border
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
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <label style={{ fontSize: '12px', minWidth: '40px' }}>寬度:</label>
            <input
              type="number"
              placeholder="0"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              style={{
                border: '1px solid #ddd',
                padding: '4px 8px',
                fontSize: '12px',
                width: '60px',
                borderRadius: '4px'
              }}
              min="0"
              step="0.1"
            />
            <select
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
            </select>
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