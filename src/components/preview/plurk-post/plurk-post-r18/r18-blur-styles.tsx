"use client";

import { R18_BLUR_STYLE_DEFAULTS } from "@/store/styleManager/defaults";
import { useStyleManager, useStyleProp } from "@/store/styleManager/styleManager";
import { cssValueToString } from "@/store/styleManager/utils/cssValue";
import { useEffect } from "react";
import { R18_BLUR_SELECTOR } from "./r18-blur.constants";

/**
 * 用途：註冊 R18 模糊預設，並常駐輸出預覽 CSS（含預設），取代 PostSupplementStyles 寫死值。
 *
 * 預覽刻意在 hover（`.link_extend`）時仍顯示模糊，讓右鍵調滑桿能即時看見；
 * 僅在點開展開（`.plurk_box`）時清掉模糊。匯出 selector 仍為未展開專用。
 */
export const R18BlurStyles = () => {
  const setInitialBatch = useStyleManager((s) => s.setInitialBatch);

  useEffect(() => {
    setInitialBatch(R18_BLUR_SELECTOR, R18_BLUR_STYLE_DEFAULTS);
  }, [setInitialBatch]);

  const filter = useStyleProp(R18_BLUR_SELECTOR, "filter");
  const filterValue =
    cssValueToString(filter.value) || R18_BLUR_STYLE_DEFAULTS.filter;

  return (
    <style>{`
      body#pcg .timeline-cnt .porn .text_holder.text_holder {
        filter: ${filterValue};
      }
      body#pcg .timeline-cnt .porn.plurk_box .text_holder.text_holder {
        filter: none;
      }
    `}</style>
  );
};
