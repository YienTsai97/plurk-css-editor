import { IconReplurk } from "@/components/preview/common/preview-icons";
import type { ManagerIconState, PlurkManagerIconProps } from "./icon-state.type";

export function getManagerReplurkIconClassName(state: ManagerIconState): string {
  return state === "on" ? "replurk replurk-on" : "replurk replurk-off";
}

const PlurkManagerReplurkIcon = ({ state, onToggle, displayCount }: PlurkManagerIconProps) => {
  const interactive = Boolean(onToggle);

  return (
    <a
      className={getManagerReplurkIconClassName(state)}
      onClick={
        interactive
          ? (e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggle?.(e);
            }
          : undefined
      }
      aria-label="轉噗"
    >
      <IconReplurk size={14} />
      {state === "on" && <span>{Math.max(displayCount ?? 0, 1)}</span>}
    </a>
  );
};

export default PlurkManagerReplurkIcon;
