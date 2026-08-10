import type { MouseEvent } from "react"
import { useCallback, useEffect, useMemo, useState } from "react"
import type { ManagerIconState } from "./icon-state.type"

/**
 * Manager icon 開關與（選用）計數 — 設計說明
 *
 * - useManagerIconToggle：僅 on/off，給靜音等。toggle 翻轉本地 on；與 PostData 對齊靠下面 effect。
 * - useManagerIconToggleWithCount：再加 count；handleToggle 依「點擊當下是否為 on」做 -1 / +1 並翻轉 on（給讚、轉噗）。
 *
 * baselineCount：由 stored（如 likeCount）與 state 推算初始顯示數字；若已為 on 且無數字則至少 1。
 *
 * initialFromProps === "on" 的 "on" 是 ManagerIconState 字串，指父層傳入的初始狀態（如 data.muteState），
 * 不是 DOM。setOn(initialFromProps === "on") 是把本地 boolean 對齊 props（true 或 false），不是「永遠設成 on」。
 *
 * useEffect([postId, initialFromProps])：只在換噗（pid）或父層初始 on/off 變了時重設本地 on；一般點擊 icon 不會觸發。
 * useState(() => initialFromProps === "on")：懶初始化，第一次掛載時把本地 on 設成與 props 一致（=== "on" 為 true，否則 false）。
 *
 * useMemo(baseline)：僅在 postId / storedCount / initialFromProps 變了才重算基準數；搭配 effect 同步 count。
 * useCallback(toggle, [])：toggle 內用 setOn(v => !v)，可不依賴 on，參考較穩。
 * useCallback(handleToggle, [on])：加減 count 需讀當下 on，on 變了須換新 closure。
 */

function baselineCount(
  stored: number | undefined,
  state: ManagerIconState,
): number {
  const n = stored ?? 0
  if (state === "on" && n === 0) return 1
  return n
}

/**
 * manager 圖示共用：與 PostData 初始值同步（換 pid／props 時重設），並提供切換。
 */
export function useManagerIconToggle(
  postId: string,
  initialFromProps: ManagerIconState,
) {
  const [on, setOn] = useState(() => initialFromProps === "on")

  useEffect(() => {
    setOn(initialFromProps === "on")
  }, [postId, initialFromProps])

  const state: ManagerIconState = on ? "on" : "off"

  const toggle = useCallback((_e: MouseEvent<HTMLAnchorElement>) => {
    setOn((v) => !v)
  }, [])

  return { state, toggle, isOn: on }
}

/**
 * 同上，並維護顯示用數字（點擊 on↔off 時 +1／-1）。給 like / replurk。
 */
export function useManagerIconToggleWithCount(
  postId: string,
  initialFromProps: ManagerIconState,
  storedCount: number | undefined,
) {
  const [on, setOn] = useState(() => initialFromProps === "on")

  useEffect(() => {
    setOn(initialFromProps === "on")
  }, [postId, initialFromProps])

  const baseline = useMemo(
    () => baselineCount(storedCount, initialFromProps),
    [postId, storedCount, initialFromProps],
  )

  const [count, setCount] = useState(baseline)
  useEffect(() => {
    setCount(baseline)
  }, [baseline])

  const state: ManagerIconState = on ? "on" : "off"

  const handleToggle = useCallback(
    (_e: MouseEvent<HTMLAnchorElement>) => {
      setCount((c) => (on ? Math.max(0, c - 1) : c + 1))
      setOn((v) => !v)
    },
    [on],
  )

  return { state, isOn: on, count, handleToggle }
}
