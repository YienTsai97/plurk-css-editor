"use client";

import ImageUploader from "@/components/controllers/ImageUploader";
import { EditorMenuContent } from "@/components/editor/editor-context-menu";
import {
  ContextMenu,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { BODY_STYLE_DEFAULTS } from "@/store/styleManager/defaults";
import { useStyleProp } from "@/store/styleManager/styleManager";
import type { ReactNode } from "react";
import { useState } from "react";
import { TIMELINE_BACKGROUND_SELECTOR } from "./timeline-background.constants";
import { TimelineBackgroundMenu } from "./timeline-background-menu";
import { TimelineBackgroundStyles } from "./timeline-background-styles";
import { toBackgroundImageCssValue } from "./timeline-background.utils";

type TimelineBackgroundProps = {
  children: ReactNode;
  isLoggingIn: boolean;
};

/**
 * 用途：河道背景 feature wrapper。
 *
 * 這裡同時常駐掛載背景預覽 CSS、ImageUploader dialog，以及河道右鍵選單。
 * dialog state 放在 wrapper，不放在 ContextMenuContent 裡，避免選單關閉時 dialog 被 unmount。
 */
export const TimelineBackground = ({
  children,
  isLoggingIn,
}: TimelineBackgroundProps) => {
  const [backgroundDialogOpen, setBackgroundDialogOpen] = useState(false);
  const backgroundImage = useStyleProp(TIMELINE_BACKGROUND_SELECTOR, "backgroundImage");
  const backgroundSize = useStyleProp(TIMELINE_BACKGROUND_SELECTOR, "backgroundSize");
  const backgroundRepeat = useStyleProp(TIMELINE_BACKGROUND_SELECTOR, "backgroundRepeat");

  return (
    <>
      <TimelineBackgroundStyles />

      <ImageUploader
        showTrigger={false}
        open={backgroundDialogOpen}
        onOpenChange={setBackgroundDialogOpen}
        isLoggingIn={isLoggingIn}
        onUploadedUrl={(url) => {
          const v = toBackgroundImageCssValue(url);
          backgroundImage.set(v);
          backgroundSize.set(BODY_STYLE_DEFAULTS.backgroundSize);
          backgroundRepeat.set(BODY_STYLE_DEFAULTS.backgroundRepeat);
        }}
        onResetBackground={() => {
          backgroundImage.set(backgroundImage.initial ?? BODY_STYLE_DEFAULTS.backgroundImage);
          backgroundSize.set(backgroundSize.initial ?? BODY_STYLE_DEFAULTS.backgroundSize);
          backgroundRepeat.set(backgroundRepeat.initial ?? BODY_STYLE_DEFAULTS.backgroundRepeat);
        }}
      />

      <ContextMenu>
        <ContextMenuTrigger>{children}</ContextMenuTrigger>
        <EditorMenuContent>
          <TimelineBackgroundMenu
            onOpenBackgroundDialog={() => setBackgroundDialogOpen(true)}
          />
        </EditorMenuContent>
      </ContextMenu>
    </>
  );
};
