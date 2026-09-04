import {
  IconVolume,
  IconVolumeMute
} from "@/components/preview/common/preview-icons";
import type { ManagerIconState, PlurkManagerIconProps } from "./icon-state.type";

export function getManagerMuteIconClassName(state: ManagerIconState): string {
  return state === "on" ? "mute mute-on" : "mute mute-off";
}

export function PlurkManagerMuteIcon({ state, onToggle }: PlurkManagerIconProps) {
  const interactive = Boolean(onToggle);

  return (
    <a
      className={getManagerMuteIconClassName(state)}
      onClick={
        interactive
          ? (e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggle?.(e);
          }
          : undefined
      }
      aria-label={state === "on" ? "取消消音" : "消音"}
    >
      {state === "on" ? <IconVolumeMute size={22} /> : <IconVolume size={22} />}
    </a>
  );
}
