import type { MouseEvent } from "react"


export type ManagerIconState = "on" | "off"

export type PlurkManagerIconProps = {
  state: ManagerIconState
  onToggle?: (e: MouseEvent<HTMLAnchorElement>) => void
  displayCount?: number
}

