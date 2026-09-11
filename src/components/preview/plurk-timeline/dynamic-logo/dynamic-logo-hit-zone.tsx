"use client";

import { forwardRef, type CSSProperties, type ComponentPropsWithoutRef } from "react";
import type { LogoPosition } from "./dynamic-logo.utils";
import {
  computeLogoHitZoneBox,
  logoHitZoneBoxToStyle,
} from "./dynamic-logo-hit-zone.utils";

export type DynamicLogoHitZoneProps = {
  /** 用途：store 的 background-size（`NNpx`）。 */
  backgroundSize: unknown;
  /** 用途：已 parse 的雙 calc 位置模型。 */
  position: LogoPosition;
  /** 用途：原圖寬；未就緒時熱區隱藏且不攔截事件。 */
  naturalWidth: number | null;
  /** 用途：原圖高；與 width 一併推算顯示高度。 */
  naturalHeight: number | null;
} & ComponentPropsWithoutRef<"div">;

/**
 * 用途：預覽專用噗寶 hit hotzone（不可見、pointer-events: auto）。
 *
 * 為什麼需要：
 * - 有自訂圖時 `#dynamic_logo` shell 為 100%×100% + pointer-events: none，
 *   空白區才能穿透到河道右鍵選單。
 * - 本元件對齊可見 logo 的 size／position，承接 ContextMenuTrigger，
 *   只有右鍵靠近圖時才開噗寶選單。
 *
 * 僅存在於預覽 DOM，不進匯出 CSS。
 */
export const DynamicLogoHitZone = forwardRef<HTMLDivElement, DynamicLogoHitZoneProps>(
  function DynamicLogoHitZone(
    {
      backgroundSize,
      position,
      naturalWidth,
      naturalHeight,
      style,
      ...rest
    },
    ref,
  ) {
    const box =
      naturalWidth != null &&
      naturalHeight != null &&
      naturalWidth > 0 &&
      naturalHeight > 0
        ? computeLogoHitZoneBox({
            backgroundSize,
            position,
            naturalWidth,
            naturalHeight,
          })
        : null;

    // 用途：size／natural 未就緒時降級為不攔截，避免擋住河道。
    const resolvedStyle: CSSProperties = box
      ? logoHitZoneBoxToStyle(box)
      : {
          position: "absolute",
          width: 0,
          height: 0,
          overflow: "hidden",
          pointerEvents: "none",
        };

    return (
      <div
        ref={ref}
        aria-hidden
        data-dynamic-logo-hit-zone=""
        style={{ ...resolvedStyle, ...style }}
        {...rest}
      />
    );
  },
);
