"use client"
import { CssValue } from "@/types/css.type";
import { normalizeBorder } from "@/utils/border";
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
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

  const apply = () => {
    if (composed) {
      const result = normalizeBorder(composed);
      if (result.ok) {
        setChange(result.value);
      } else {
        // 如果驗證失敗，設為 none
        setChange("none");
        // 重置內部狀態
        setWidth("0");
        setUnit("px");
        setStyle("");
        setColor("rgba(0, 0, 0, 0)");
        console.log(`Oops! ${result.errors} :(`)
      }
    }
  };

  const resetToNone = () => {
    setWidth("0");
    setUnit("px");
    setStyle("none");
    setColor("rgba(0, 0, 0, 0)");
    setChange("none");
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button type="button" style={{ fontSize: '12px', color: '#666' }}>
          Set Border
        </button>
      </PopoverTrigger>
      <PopoverContent style={{ padding: '16px', minWidth: '300px' }}>
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
            <button
              type="button"
              onClick={() => setColor("rgba(0, 0, 0, 0)")}
              style={{
                fontSize: '12px',
                color: '#666',
                border: '1px solid #ddd',
                padding: '4px 8px',
                borderRadius: '4px',
                background: 'transparent'
              }}
            >
              透明
            </button>
          </div>

          <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between' }}>
            <button
              type="button"
              onClick={resetToNone}
              style={{
                fontSize: '12px',
                color: '#666',
                border: '1px solid #ddd',
                padding: '8px 12px',
                borderRadius: '4px',
                background: 'transparent'
              }}
            >
              重置為無
            </button>
            <button
              type="button"
              onClick={apply}
              style={{
                fontSize: '12px',
                color: '#fff',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                background: '#007bff'
              }}
            >
              套用
            </button>
          </div>

          {composed && (
            <div style={{
              fontSize: '11px',
              color: '#666',
              padding: '8px',
              background: '#f5f5f5',
              borderRadius: '4px',
              fontFamily: 'monospace'
            }}>
              預覽: {composed}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default BorderEditor