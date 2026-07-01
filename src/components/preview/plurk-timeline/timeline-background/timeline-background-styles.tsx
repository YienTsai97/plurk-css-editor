"use client";

import { EditorPageStyle } from "@/app/editor/page.style";
import { BODY_STYLE_DEFAULTS } from "@/store/styleManager/defaults";
import { useStyleManager, useStyleProp } from "@/store/styleManager/styleManager";
import { CssValue } from "@/types/css.type";
import { useEffect } from "react";
import { TIMELINE_BACKGROUND_SELECTOR } from "./timeline-background.constants";

/** 用途：河道背景 feature 的常駐樣式層，負責註冊 body 預設值與渲染 body 背景預覽 CSS。 */
export const TimelineBackgroundStyles = () => {
  const setInitialBatch = useStyleManager((s) => s.setInitialBatch);

  /** 用途：註冊 body 背景相關預設值，確保匯出只包含匯入或手動調整的 props。 */
  useEffect(() => {
    setInitialBatch(TIMELINE_BACKGROUND_SELECTOR, BODY_STYLE_DEFAULTS);
  }, [setInitialBatch]);

  /** 用途：訂閱 body 背景 props，並交給原本的 EditorPageStyle 生成預覽 CSS。 */
  const backgroundImage = useStyleProp(TIMELINE_BACKGROUND_SELECTOR, "backgroundImage");
  const backgroundSize = useStyleProp(TIMELINE_BACKGROUND_SELECTOR, "backgroundSize");
  const backgroundRepeat = useStyleProp(TIMELINE_BACKGROUND_SELECTOR, "backgroundRepeat");
  const backgroundPosition = useStyleProp(TIMELINE_BACKGROUND_SELECTOR, "backgroundPosition");
  const backgroundAttachment = useStyleProp(TIMELINE_BACKGROUND_SELECTOR, "backgroundAttachment");

  const backgroundImageChanged =
    backgroundImage.value !== backgroundImage.initial &&
    backgroundImage.value !== "none";
  const backgroundSizeChanged = backgroundSize.value !== backgroundSize.initial;
  const backgroundRepeatChanged = backgroundRepeat.value !== backgroundRepeat.initial;

  return (
    <EditorPageStyle
      backgroundImage={backgroundImage.value as CssValue}
      backgroundSize={backgroundSize.value as CssValue}
      backgroundRepeat={backgroundRepeat.value as CssValue}
      backgroundPosition={backgroundPosition.value as CssValue}
      backgroundAttachment={backgroundAttachment.value as CssValue}
      backgroundImageChanged={backgroundImageChanged}
      backgroundSizeChanged={backgroundSizeChanged}
      backgroundRepeatChanged={backgroundRepeatChanged}
    />
  );
};
