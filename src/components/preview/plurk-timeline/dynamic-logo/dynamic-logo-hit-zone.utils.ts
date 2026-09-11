import { cssValueToString } from "@/store/styleManager/utils/cssValue";
import type { CSSProperties } from "react";
import type { LogoPosition } from "./dynamic-logo.utils";

/**
 * 用途：從 store 的 `background-size: NNpx` 解析顯示寬度。
 * 目前寫入格式僅單軸 px（高度依原圖比例 auto）。
 */
export function parseLogoBackgroundSizePx(value: unknown): number | null {
  const text = cssValueToString(value).trim();
  const match = text.match(/^(\d+(?:\.\d+)?)\s*px$/i);
  if (!match) return null;
  const n = Number(match[1]);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export type LogoHitZoneBox = {
  widthPx: number;
  heightPx: number;
  /** 用途：xBase 0 → left；xBase 100 → right（對齊 background-position 雙 calc）。 */
  leftPx: number | "auto";
  rightPx: number | "auto";
  topPx: number | "auto";
  bottomPx: number | "auto";
};

/**
 * 用途：把 background-size + 雙 calc 位置 + 原圖比例，換成 shell 內 absolute box。
 *
 * 幾何對齊 CSS background-position：
 * - `calc(100% - Npx)` ≡ 距右 Npx（right: N）
 * - `calc(0% + Npx)` ≡ 距左 Npx（left: N）
 * - Y 軸同理（top / bottom）
 *
 * height = width × (naturalHeight / naturalWidth)，對齊 `background-size: NNpx` 的 auto 高度。
 */
export function computeLogoHitZoneBox(params: {
  backgroundSize: unknown;
  position: LogoPosition;
  naturalWidth: number;
  naturalHeight: number;
}): LogoHitZoneBox | null {
  const { naturalWidth, naturalHeight, position } = params;
  if (!(naturalWidth > 0 && naturalHeight > 0)) return null;

  const widthPx = parseLogoBackgroundSizePx(params.backgroundSize);
  if (widthPx == null) return null;

  const heightPx = Math.round(widthPx * (naturalHeight / naturalWidth));
  if (!(heightPx > 0)) return null;

  return {
    widthPx,
    heightPx,
    leftPx: position.xBase === 0 ? position.xOffsetPx : "auto",
    rightPx: position.xBase === 100 ? position.xOffsetPx : "auto",
    topPx: position.yBase === 0 ? position.yOffsetPx : "auto",
    bottomPx: position.yBase === 100 ? position.yOffsetPx : "auto",
  };
}

/**
 * 用途：LogoHitZoneBox → 預覽 hit overlay 的 inline style（pointer-events: auto）。
 */
export function logoHitZoneBoxToStyle(box: LogoHitZoneBox): CSSProperties {
  return {
    position: "absolute",
    width: box.widthPx,
    height: box.heightPx,
    left: box.leftPx,
    right: box.rightPx,
    top: box.topPx,
    bottom: box.bottomPx,
    pointerEvents: "auto",
    background: "transparent",
    // 用途：高於隱藏的 creature，確保右鍵落在熱區。
    zIndex: 2,
  };
}
