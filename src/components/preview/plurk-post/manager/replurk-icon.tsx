import { ManagerIconState, PlurkManagerIconProps } from "./icon-state.type"


export function getManagerReplurkIconClassName(state: ManagerIconState): string {
  return state === "on"
    ? "pif-replurk replurk replurk-on"
    : "pif-replurk replurk replurk-off"
}

const PlurkManagerReplurkIcon = ({ state, onToggle, displayCount }: PlurkManagerIconProps) => {
  const interactive = Boolean(onToggle)

  return (
    <a
      className={getManagerReplurkIconClassName(state)}
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

export default PlurkManagerReplurkIcon