"use client";

import { useCallback, useEffect, useRef } from "react";
import type { PointerEvent } from "react";

/** 用途：首步立刻後，再等這段才開始連發。 */
const HOLD_NUDGE_DELAY_MS = 350;
/** 用途：連發間隔。 */
const HOLD_NUDGE_INTERVAL_MS = 60;

type NudgeHandler = (dx: number, dy: number) => void;

/**
 * 用途：方向鍵按住連發微調。
 * 立刻走一步，約 350ms 後每 60ms 再送一次。
 * 用 ref 永遠呼叫最新 onNudge，避免 interval 閉包鎖在 pointerdown 當下的位置。
 */
export function useLogoHoldNudge(onNudge: NudgeHandler) {
  const onNudgeRef = useRef(onNudge);
  onNudgeRef.current = onNudge;

  const delayIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalIdRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopHold = useCallback(() => {
    if (delayIdRef.current != null) {
      clearTimeout(delayIdRef.current);
      delayIdRef.current = null;
    }
    if (intervalIdRef.current != null) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
  }, []);

  useEffect(() => stopHold, [stopHold]);

  const arrowHoldProps = useCallback(
    (dx: number, dy: number) => ({
      onPointerDown: (event: PointerEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();
        if (event.button !== 0 || event.currentTarget.disabled) return;
        event.currentTarget.setPointerCapture(event.pointerId);
        stopHold();
        onNudgeRef.current(dx, dy);
        delayIdRef.current = setTimeout(() => {
          intervalIdRef.current = setInterval(() => {
            onNudgeRef.current(dx, dy);
          }, HOLD_NUDGE_INTERVAL_MS);
        }, HOLD_NUDGE_DELAY_MS);
      },
      // 用途：不在 pointerleave 停；capture 期間離開仍可連發到鬆開。
      onPointerUp: stopHold,
      onPointerCancel: stopHold,
      onLostPointerCapture: stopHold,
      onBlur: stopHold,
    }),
    [stopHold],
  );

  return arrowHoldProps;
}
