import type { ReactNode } from "react"
import type { StyleProps } from "@/store/styleManager/types"
import type { ManagerIconState } from "./manager/icon-state.type"

/** 貼文預覽樣式：`StyleKey` 與 store 一致；附帶「是否與 initial 不同」旗標（`.plurk_cnt` 與 `.name` 的 `color`）。 */
export type PlurkPostPreviewStyleProps = Required<
  Pick<StyleProps, "backgroundColor" | "backgroundImage" | "border" | "color">
> & {
  hasManualChanges: boolean
  backgroundColorChanged: boolean
  backgroundImageChanged: boolean
  borderChanged: boolean
  colorChanged: boolean
}

export type PostQualifier = {
  text: string
  className: string
}

export type PostReaction = {
  src: string
  count: number
}

export type PostResponse = {
  id: string
  displayName: string
  nameColor?: string
  content: ReactNode
  isOwner?: boolean
}

export type PostThread = {
  reactionCount: number
  responseLabel: string
  responses: PostResponse[]
}

export type PostData = {
  pid: string
  avatarUrl: string
  displayName: string
  nameColor?: string
  qualifier?: PostQualifier
  showPornIcon?: boolean
  content: ReactNode
  reactions?: PostReaction[]
  showEdit: boolean
  /** 初始是否靜音（圖示 on／off；切換狀態由 PlurkPost 內部 state 維持） */
  muteState: ManagerIconState
  likeState: ManagerIconState
  /** 初始愛心數；預覽內點讚會 +1／取消 -1，由 PlurkPost 內 state 維持 */
  likeCount?: number
  /** 轉噗圖示 on／off；為 on 時才顯示數字 */
  replurkState: ManagerIconState
  showReplurk?: boolean
  /** 初始轉噗數；預覽內切換 on/off 會 +1／-1，由 PlurkPost 內 state 維持 */
  replurkCount?: number
  showMark?: boolean
  responseCount: number
  showResponseCount: boolean
  timeText: string
  thread?: PostThread
}

export type PlurkPostProps = {
  data: PostData
  skipStyles?: boolean
}
