import type { PostData } from "./plurk-post.types"

/** 用途：右鍵選單依貼文類型決定要顯示哪些類型專屬項目。 */
export type PostTypeMenuFlags = {
  showR18: boolean
  showWhisper: boolean
  showMuted: boolean
}

/**
 * 用途：從 PostData／外層 class／實際 mute 狀態推導選單旗標。
 * 各旗標可同時成立（例如 R18 又被消音），對應選項可並存。
 */
export function getPostTypeMenuFlags(
  data: PostData,
  options?: { isMuted?: boolean; slotClassName?: string },
): PostTypeMenuFlags {
  const classes = (options?.slotClassName ?? "").split(/\s+/).filter(Boolean)

  return {
    showR18: Boolean(data.showPornIcon) || classes.includes("porn"),
    showWhisper: data.qualifier?.className === "q_whispers",
    showMuted: options?.isMuted ?? data.muteState === "on",
  }
}
