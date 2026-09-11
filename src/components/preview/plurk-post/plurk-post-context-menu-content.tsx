import {
  EditorMenuTitle
} from "@/components/editor/editor-context-menu";
import { PlurkPostAppearanceMenu } from "@/components/preview/plurk-post/plurk-post-appearance/plurk-post-appearance-menu";
import { MutedOpacityMenu } from "@/components/preview/plurk-post/plurk-post-muted/muted-opacity-menu";
import { R18BlurMenu } from "@/components/preview/plurk-post/plurk-post-r18/r18-blur-menu";
import type { PostTypeMenuFlags } from "@/components/preview/plurk-post/plurk-post-type-menu-flags";
import { WhisperQualifierMenu } from "@/components/preview/plurk-post/plurk-post-whisper/whisper-qualifier-menu";
import { ResponseCountMenu } from "@/components/preview/plurk-timeline/response-count/response-count-menu";

type PlurkPostContextMenuContentProps = {
  typeMenus: PostTypeMenuFlags;
};

/** 用途：貼文右鍵選單內容組裝；類型專屬項目依當下貼文旗標顯示。 */
export const PlurkPostContextMenuContent = ({
  typeMenus,
}: PlurkPostContextMenuContentProps) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <EditorMenuTitle>噗文</EditorMenuTitle>
      <PlurkPostAppearanceMenu />
      <ResponseCountMenu />
      {(typeMenus.showR18 || typeMenus.showMuted || typeMenus.showWhisper) && (
        <>
          <div style={{ borderBottom: "1px solid #e5e7eb" }}></div>
          {typeMenus.showR18 && <R18BlurMenu />}
          {typeMenus.showMuted && <MutedOpacityMenu />}
          {typeMenus.showWhisper && <WhisperQualifierMenu />}
        </>
      )}
    </div>
  );
};
