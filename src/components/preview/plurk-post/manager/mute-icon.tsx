import type { ManagerIconState, PlurkManagerIconProps } from "./icon-state.type"

export function getManagerMuteIconClassName(state: ManagerIconState): string {
  return state === "on"
    ? "mute pif-volume-mute mute-on"
    : "mute pif-volume mute-off"
}

export function PlurkManagerMuteIcon({ state, onToggle }: PlurkManagerIconProps) {
  const interactive = Boolean(onToggle)

  return (
    <a
      className={getManagerMuteIconClassName(state)}
      onClick={
        interactive
          ? (e) => {
            e.preventDefault()
            e.stopPropagation()
            onToggle?.(e)
          }
          : undefined
      }
    />
  )
}
