import {
  EditorMenuTitle
} from "@/components/editor/editor-context-menu";
import { PlurkPostAppearanceMenu } from "@/components/preview/plurk-post/plurk-post-appearance/plurk-post-appearance-menu";
import { ResponseCountMenu } from "@/components/preview/plurk-timeline/response-count/response-count-menu";

/** 用途：貼文右鍵選單的內容組裝，負責把貼文外觀與其他全域子區塊放進同一套 menu 架構。 */
export const PlurkPostContextMenuContent = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {/* 用途：標示目前正在編輯的主要區塊。 */}
      <EditorMenuTitle>噗文</EditorMenuTitle>

      <PlurkPostAppearanceMenu />

      {/* 用途：其他掛在貼文選單下，但作用範圍可能是全域 selector 的設定入口。 */}
      {/* <EditorMenuSectionLabel>其他區塊</EditorMenuSectionLabel> */}
      <ResponseCountMenu />
    </div>
  )
}