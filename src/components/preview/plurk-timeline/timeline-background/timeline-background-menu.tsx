"use client";

import {
  EditorMenuItem,
  EditorMenuTitle,
} from "@/components/editor/editor-context-menu";
import { TimelineDecorationMenu } from "../timeline-decoration/timeline-decoration-menu";

type TimelineBackgroundMenuProps = {
  onOpenBackgroundDialog: () => void;
  onOpenDecorationDialog: () => void;
};

/**
 * 用途：河道右鍵選單內容。
 * 背景圖與裝飾圖各自開獨立 ImageUploader，選單只負責入口，dialog 由 wrapper 常駐管理。
 */
export const TimelineBackgroundMenu = ({
  onOpenBackgroundDialog,
  onOpenDecorationDialog,
}: TimelineBackgroundMenuProps) => {
  return (
    <>
      <EditorMenuTitle>河道</EditorMenuTitle>
      <EditorMenuItem onSelect={onOpenBackgroundDialog}>更換背景圖</EditorMenuItem>
      <TimelineDecorationMenu onOpenDecorationDialog={onOpenDecorationDialog} />
    </>
  );
};
