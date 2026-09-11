"use client";

import { TIMELINE_DECORATION_STYLE_DEFAULTS } from "@/store/styleManager/defaults";
import { useStyleManager, useStyleProp } from "@/store/styleManager/styleManager";
import { cssValueToString } from "@/store/styleManager/utils/cssValue";
import type { CssValue } from "@/types/css.type";
import { useEffect } from "react";
import { TIMELINE_DECORATION_SELECTOR } from "./timeline-decoration.constants";
import { hasDecorationImage } from "./timeline-decoration.utils";

/**
 * 用途：時間軸裝飾 feature 的常駐樣式層。
 *
 * 註冊 `._lc_ .timeline-bg` 預設值，並在有背景圖時以高權重預覽 CSS 套用四個 background 屬性。
 * 需常駐掛載，不能依賴右鍵選單是否開啟。
 */
export const TimelineDecorationStyles = () => {
  const setInitialBatch = useStyleManager((s) => s.setInitialBatch);

  useEffect(() => {
    setInitialBatch(TIMELINE_DECORATION_SELECTOR, TIMELINE_DECORATION_STYLE_DEFAULTS);
  }, [setInitialBatch]);

  const backgroundImage = useStyleProp(TIMELINE_DECORATION_SELECTOR, "backgroundImage");
  const backgroundSize = useStyleProp(TIMELINE_DECORATION_SELECTOR, "backgroundSize");
  const backgroundRepeat = useStyleProp(TIMELINE_DECORATION_SELECTOR, "backgroundRepeat");
  const backgroundPosition = useStyleProp(TIMELINE_DECORATION_SELECTOR, "backgroundPosition");

  if (!hasDecorationImage(backgroundImage.value as CssValue)) {
    return null;
  }

  const image = cssValueToString(backgroundImage.value);
  const size = cssValueToString(backgroundSize.value) || TIMELINE_DECORATION_STYLE_DEFAULTS.backgroundSize;
  const repeat =
    cssValueToString(backgroundRepeat.value) || TIMELINE_DECORATION_STYLE_DEFAULTS.backgroundRepeat;
  const position =
    cssValueToString(backgroundPosition.value) ||
    TIMELINE_DECORATION_STYLE_DEFAULTS.backgroundPosition;

  // 用途：body#pcg + 重複 class 拉高權重，蓋過 plurk-timeline 內建定位樣式。
  const css = `
body#pcg ._lc_ .timeline-bg.timeline-bg {
  background-image: ${image};
  background-size: ${size};
  background-repeat: ${repeat};
  background-position: ${position};
}`;

  return <style>{css}</style>;
};
