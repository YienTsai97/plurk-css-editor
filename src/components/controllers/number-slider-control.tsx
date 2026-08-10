"use client"

import { Slider } from "@/components/ui/slider";
import type { CSSProperties, ReactNode } from "react";

type NumberSliderControlProps = {
  label: ReactNode;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max: number;
  step?: number;
  unit?: string;
  style?: CSSProperties;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const formatValue = (value: number, step: number) => {
  const precision = step.toString().split(".")[1]?.length ?? 0;
  return value.toFixed(precision).replace(/\.0+$/, "");
};

/** 用途：共用的數值 slider 列。不同 controller 可自行傳入 max/step/unit，避免每個地方手寫數字 input。 */
export const NumberSliderControl = ({
  label,
  value,
  onChange,
  min = 0,
  max,
  step = 1,
  unit = "",
  style,
}: NumberSliderControlProps) => {
  const safeValue = clamp(Number.isFinite(value) ? value : min, min, max);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, ...style }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          fontSize: 12,
          color: "#374151",
        }}
      >
        <span>{label}</span>
        <span style={{ color: "#6b7280", fontVariantNumeric: "tabular-nums" }}>
          {formatValue(safeValue, step)}
          {unit}
        </span>
      </div>
      <Slider
        value={[safeValue]}
        min={min}
        max={max}
        step={step}
        onValueChange={([nextValue]) => {
          onChange(clamp(nextValue ?? min, min, max));
        }}
      />
    </div>
  );
};
