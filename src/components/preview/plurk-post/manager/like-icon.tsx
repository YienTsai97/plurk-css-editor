import type { ManagerIconState, PlurkManagerIconProps } from "./icon-state.type"

export function getManagerLikeIconClassName(state: ManagerIconState): string {
  return state === "on"
    ? "pif-like like like-on"
    : "pif-like like like-off"
}

export function PlurkManagerLikeIcon({ state, onToggle, displayCount }: PlurkManagerIconProps) {
  const interactive = Boolean(onToggle)

  return (
    <a
      className={getManagerLikeIconClassName(state)}
      onClick={
        interactive
          ? (e) => {
            e.preventDefault()
            e.stopPropagation()
            onToggle?.(e)
          }
          : undefined
      }
    >
      {state === "on" && <span>{Math.max(displayCount ?? 0, 1)}</span>}
    </a>
  )
}
