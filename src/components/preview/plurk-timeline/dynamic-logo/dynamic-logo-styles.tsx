"use client";

import {
  DYNAMIC_LOGO_IMG_STYLE_DEFAULTS,
  DYNAMIC_LOGO_STYLE_DEFAULTS,
} from "@/store/styleManager/defaults";
import { useStyleManager, useStyleProp } from "@/store/styleManager/styleManager";
import { cssValueToString } from "@/store/styleManager/utils/cssValue";
import type { CssValue } from "@/types/css.type";
import { useEffect } from "react";
import {
  DYNAMIC_LOGO_IMG_SELECTOR,
  DYNAMIC_LOGO_SELECTOR,
} from "./dynamic-logo.constants";
import { hasCustomLogoImage } from "./dynamic-logo.utils";

/**
 * 用途：噗寶自定義 feature 的常駐樣式層。
 *
 * 註冊 `#dynamic_logo`／`#dynamic_logo > img` 預設值；有自訂圖時注入高權重預覽 CSS
 *（隱藏官方 creature、鋪 background-*，以及 width/height／z-index:1／transition shell）。
 *
 * 預覽 shell 另設 pointer-events: none（不進匯出）：空白區穿透到河道；
 * 右鍵選單改由 dynamic-logo-hit-zone 熱區承接。
 * 匯出 z-index 為 500，見 formatDynamicLogoExportBlock。
 */
export const DynamicLogoStyles = () => {
  const setInitialBatch = useStyleManager((s) => s.setInitialBatch);

  useEffect(() => {
    setInitialBatch(DYNAMIC_LOGO_SELECTOR, DYNAMIC_LOGO_STYLE_DEFAULTS);
    setInitialBatch(DYNAMIC_LOGO_IMG_SELECTOR, DYNAMIC_LOGO_IMG_STYLE_DEFAULTS);
  }, [setInitialBatch]);

  const backgroundImage = useStyleProp(DYNAMIC_LOGO_SELECTOR, "backgroundImage");
  const backgroundSize = useStyleProp(DYNAMIC_LOGO_SELECTOR, "backgroundSize");
  const backgroundRepeat = useStyleProp(DYNAMIC_LOGO_SELECTOR, "backgroundRepeat");
  const backgroundPosition = useStyleProp(DYNAMIC_LOGO_SELECTOR, "backgroundPosition");

  if (!hasCustomLogoImage(backgroundImage.value as CssValue)) {
    return null;
  }

  const image = cssValueToString(backgroundImage.value);
  const size =
    cssValueToString(backgroundSize.value) || DYNAMIC_LOGO_STYLE_DEFAULTS.backgroundSize;
  const repeat =
    cssValueToString(backgroundRepeat.value) ||
    DYNAMIC_LOGO_STYLE_DEFAULTS.backgroundRepeat;
  const position =
    cssValueToString(backgroundPosition.value) ||
    DYNAMIC_LOGO_STYLE_DEFAULTS.backgroundPosition;

  // 用途：body#pcg 提高權重，蓋過 plurk-timeline 內建 #dynamic_logo 定位／:where z-index。
  // shell（width/height／z-index:1／transition／pointer-events）不進 StyleKey，僅預覽注入。
  // pointer-events: none → 空白區給河道；熱區子層自行 pointer-events: auto（見 hit-zone）。
  // 有圖時預覽一律隱藏官方 creature（store opacity 仍供匯出）；img 亦不攔截事件。
  const css = `
body#pcg #dynamic_logo {
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
  -webkit-transition: none;
  -moz-transition: none;
  -o-transition: none;
  transition: none;
  background-image: ${image};
  background-size: ${size};
  background-repeat: ${repeat};
  background-position: ${position};
}
body#pcg #dynamic_logo > img {
  opacity: 0;
  pointer-events: none;
}`;

  return <style>{css}</style>;
};
