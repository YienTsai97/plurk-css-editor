"use client";

import {
  EditorMenuItem,
  EditorMenuTitle
} from "@/components/editor/editor-context-menu";

type TimelineBackgroundMenuProps = {
  onOpenBackgroundDialog: () => void;
};

/** 用途：河道右鍵選單的背景設定內容，實際開啟的上傳 dialog 由 feature wrapper 常駐管理。 */
export const TimelineBackgroundMenu = ({
  onOpenBackgroundDialog,
}: TimelineBackgroundMenuProps) => {
  return (
    <>
      <EditorMenuTitle>河道</EditorMenuTitle>
      {/* <EditorMenuSectionLabel>背景設定</EditorMenuSectionLabel> */}
      <EditorMenuItem onSelect={onOpenBackgroundDialog}>
        更換背景圖
      </EditorMenuItem>
    </>
  );
};
