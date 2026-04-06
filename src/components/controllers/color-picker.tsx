"use client"
import * as Popover from "@radix-ui/react-popover";
import dynamic from "next/dynamic";
import { ColorResult } from "react-color";
const ChromePicker = dynamic(() => import("react-color").then(m => m.ChromePicker), { ssr: false });

export function toRgbaString(c: ColorResult) {
  const { r, g, b, a } = c.rgb;
  return `rgba(${r}, ${g}, ${b}, ${a ?? 1})`;
}

type Prop = {
  value: string | undefined;
  onChange: (v: string) => void
  defaultValue?: string;
  showReset?: boolean;
}

const ColorPicker = ({ value, onChange, defaultValue = "rgba(255, 255, 255, 1)", showReset = false }: Prop) => {

  const handleChange = (c: ColorResult) => {
    onChange(toRgbaString(c));
  };

  return (
    <>
      <style>
        {`
          .chrome-picker {
            background-color: transparent !important;
            border: none !important;
            box-shadow: none !important;
          }
          .chrome-picker .flexbox-picker {
            background-color: transparent !important;
            border: none !important;
            box-shadow: none !important;
          }
          .chrome-picker .flexbox-picker .flexbox-picker-inner {
            background-color: transparent !important;
          }
        `}
      </style>
      <Popover.Root>
        <Popover.Trigger asChild>
          <button type="button" style={{ fontSize: '12px', color: '#666' }}>
            Select Color
          </button>
        </Popover.Trigger>
        <Popover.Content
          side="right"
          align="start"
          sideOffset={9}
          alignOffset={-10}
          style={{
            overflow: "hidden",
            backgroundColor: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.12)",
            zIndex: 1400
          }}
        >
          <ChromePicker
            color={(value as string) || defaultValue}
            onChange={handleChange}
            disableAlpha={false}
            styles={{
              default: {
                picker: {
                  backgroundColor: 'transparent'
                }
              }
            }}
          />
          {showReset && (
            <div
              style={{
                marginTop: "8px",
                display: "flex",
                justifyContent: "flex-end",
                padding: "0 12px 12px"
              }}
            >
              <button
                type="button"
                onClick={() => onChange(defaultValue)}
                style={{
                  fontSize: "12px",
                  color: "#666",
                  border: "1px solid #ddd",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  background: "transparent"
                }}
              >
                重置為預設
              </button>
            </div>
          )}
        </Popover.Content>
      </Popover.Root>
    </>
  )
}

export default ColorPicker