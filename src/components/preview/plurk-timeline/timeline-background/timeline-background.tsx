"use client";

import ImageUploader from "@/components/controllers/ImageUploader";
import { EditorMenuContent } from "@/components/editor/editor-context-menu";
import {
  ContextMenu,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  BODY_STYLE_DEFAULTS,
  TIMELINE_DECORATION_STYLE_DEFAULTS,
} from "@/store/styleManager/defaults";
import { useStyleProp } from "@/store/styleManager/styleManager";
import type { ReactNode } from "react";
import { useState } from "react";
import { TimelineDecorationStyles } from "../timeline-decoration/timeline-decoration-styles";
import { TIMELINE_DECORATION_SELECTOR } from "../timeline-decoration/timeline-decoration.constants";
import { TimelineBackgroundMenu } from "./timeline-background-menu";
import { TimelineBackgroundStyles } from "./timeline-background-styles";
import { TIMELINE_BACKGROUND_SELECTOR } from "./timeline-background.constants";
import { toBackgroundImageCssValue } from "./timeline-background.utils";

type TimelineBackgroundProps = {
  children: ReactNode;
  isLoggingIn: boolean;
};

/**
 * 用途：河道背景 + 時間軸裝飾 feature wrapper。
 *
 * 常駐掛載兩套預覽 CSS、兩個獨立 ImageUploader，以及共用河道右鍵選單。
 * dialog state 放在 wrapper，不放在 ContextMenuContent 裡，避免選單關閉時 dialog 被 unmount。
 */
export const TimelineBackground = ({
  children,
  isLoggingIn,
}: TimelineBackgroundProps) => {
  const [backgroundDialogOpen, setBackgroundDialogOpen] = useState(false);
  const [decorationDialogOpen, setDecorationDialogOpen] = useState(false);

  const backgroundImage = useStyleProp(TIMELINE_BACKGROUND_SELECTOR, "backgroundImage");
  const backgroundSize = useStyleProp(TIMELINE_BACKGROUND_SELECTOR, "backgroundSize");
  const backgroundRepeat = useStyleProp(TIMELINE_BACKGROUND_SELECTOR, "backgroundRepeat");
  const backgroundPosition = useStyleProp(TIMELINE_BACKGROUND_SELECTOR, "backgroundPosition");

  const decorationImage = useStyleProp(TIMELINE_DECORATION_SELECTOR, "backgroundImage");
  const decorationSize = useStyleProp(TIMELINE_DECORATION_SELECTOR, "backgroundSize");
  const decorationRepeat = useStyleProp(TIMELINE_DECORATION_SELECTOR, "backgroundRepeat");
  const decorationPosition = useStyleProp(TIMELINE_DECORATION_SELECTOR, "backgroundPosition");

  return (
    <>
      <TimelineBackgroundStyles />
      <TimelineDecorationStyles />

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
          backgroundPosition.set(BODY_STYLE_DEFAULTS.backgroundPosition);
        }}
        onResetBackground={() => {
          backgroundImage.set(backgroundImage.initial ?? BODY_STYLE_DEFAULTS.backgroundImage);
          backgroundSize.set(backgroundSize.initial ?? BODY_STYLE_DEFAULTS.backgroundSize);
          backgroundRepeat.set(backgroundRepeat.initial ?? BODY_STYLE_DEFAULTS.backgroundRepeat);
          backgroundPosition.set(
            backgroundPosition.initial ?? BODY_STYLE_DEFAULTS.backgroundPosition,
          );
        }}
      />

      <ImageUploader
        showTrigger={false}
        open={decorationDialogOpen}
        onOpenChange={setDecorationDialogOpen}
        isLoggingIn={isLoggingIn}
        onUploadedUrl={(url) => {
          const v = toBackgroundImageCssValue(url);
          decorationImage.set(v);
          decorationSize.set(TIMELINE_DECORATION_STYLE_DEFAULTS.backgroundSize);
          decorationRepeat.set(TIMELINE_DECORATION_STYLE_DEFAULTS.backgroundRepeat);
          decorationPosition.set(TIMELINE_DECORATION_STYLE_DEFAULTS.backgroundPosition);
        }}
        onResetBackground={() => {
          decorationImage.set(
            decorationImage.initial ?? TIMELINE_DECORATION_STYLE_DEFAULTS.backgroundImage,
          );
          decorationSize.set(
            decorationSize.initial ?? TIMELINE_DECORATION_STYLE_DEFAULTS.backgroundSize,
          );
          decorationRepeat.set(
            decorationRepeat.initial ?? TIMELINE_DECORATION_STYLE_DEFAULTS.backgroundRepeat,
          );
          decorationPosition.set(
            decorationPosition.initial ?? TIMELINE_DECORATION_STYLE_DEFAULTS.backgroundPosition,
          );
        }}
      />

      <ContextMenu>
        <ContextMenuTrigger>{children}</ContextMenuTrigger>
        <EditorMenuContent>
          <TimelineBackgroundMenu
            onOpenBackgroundDialog={() => setBackgroundDialogOpen(true)}
            onOpenDecorationDialog={() => setDecorationDialogOpen(true)}
          />
        </EditorMenuContent>
      </ContextMenu>
    </>
  );
};
