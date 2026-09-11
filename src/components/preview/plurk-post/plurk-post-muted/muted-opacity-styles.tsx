"use client";

import { MUTED_OPACITY_STYLE_DEFAULTS } from "@/store/styleManager/defaults";
import { useStyleManager, useStyleProp } from "@/store/styleManager/styleManager";
import { cssValueToString } from "@/store/styleManager/utils/cssValue";
import { useEffect } from "react";
import { MUTED_OPACITY_SELECTOR } from "./muted-opacity.constants";

/**
 * 用途：註冊消音透明度預設，並常駐輸出預覽 CSS（含預設），取代 PostSupplementStyles 寫死值。
 */
export const MutedOpacityStyles = () => {
  const setInitialBatch = useStyleManager((s) => s.setInitialBatch);

  useEffect(() => {
    setInitialBatch(MUTED_OPACITY_SELECTOR, MUTED_OPACITY_STYLE_DEFAULTS);
  }, [setInitialBatch]);

  const opacity = useStyleProp(MUTED_OPACITY_SELECTOR, "opacity");
  const opacityValue =
    cssValueToString(opacity.value) || MUTED_OPACITY_STYLE_DEFAULTS.opacity;

  return (
    <style>{`
      body#pcg .timeline-cnt .muted.muted {
        opacity: ${opacityValue};
      }
    `}</style>
  );
};
