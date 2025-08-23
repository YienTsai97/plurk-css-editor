"use client"
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
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
}

const ColorPicker = ({ value, onChange }: Prop) => {

  const handleChange = (c: ColorResult) => {
    onChange(toRgbaString(c));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button type="button" style={{ fontSize: '12px', color: '#666' }}>
          Select Color
        </button>
      </PopoverTrigger>
      <PopoverContent>
        <ChromePicker
          color={(value as string) || "rgba(255, 255, 255, 1)"}
          onChange={handleChange}
          disableAlpha={false}
        />
      </PopoverContent>
    </Popover>
  )
}

export default ColorPicker