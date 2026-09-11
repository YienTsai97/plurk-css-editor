import { IconLike } from "@/components/preview/common/preview-icons";
import type { ManagerIconState, PlurkManagerIconProps } from "./icon-state.type";

export function getManagerLikeIconClassName(state: ManagerIconState): string {
  return state === "on" ? "like like-on" : "like like-off";
}

export function PlurkManagerLikeIcon({ state, onToggle, displayCount }: PlurkManagerIconProps) {
  const interactive = Boolean(onToggle);

  return (
    <a
      className={getManagerLikeIconClassName(state)}
      onClick={
        interactive
          ? (e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggle?.(e);
            }
          : undefined
      }
      aria-label="喜歡"
    >
      <IconLike size={14} />
      {state === "on" && <span>{Math.max(displayCount ?? 0, 1)}</span>}
    </a>
  );
}
