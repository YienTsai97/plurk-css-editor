"use client";

import { WHISPER_QUALIFIER_STYLE_DEFAULTS } from "@/store/styleManager/defaults";
import { useStyleManager, useStyleProp } from "@/store/styleManager/styleManager";
import { cssValueToString } from "@/store/styleManager/utils/cssValue";
import { useEffect } from "react";
import { WHISPER_QUALIFIER_SELECTOR } from "./whisper-qualifier.constants";

/**
 * 用途：註冊偷偷說 qualifier 背景色預設，並常駐輸出預覽 CSS（含預設）。
 */
export const WhisperQualifierStyles = () => {
  const setInitialBatch = useStyleManager((s) => s.setInitialBatch);

  useEffect(() => {
    setInitialBatch(WHISPER_QUALIFIER_SELECTOR, WHISPER_QUALIFIER_STYLE_DEFAULTS);
  }, [setInitialBatch]);

  const bgColor = useStyleProp(WHISPER_QUALIFIER_SELECTOR, "backgroundColor");
  const bgColorValue =
    cssValueToString(bgColor.value) ||
    WHISPER_QUALIFIER_STYLE_DEFAULTS.backgroundColor;

  return (
    <style>{`
      body#pcg .q_whispers.q_whispers {
        background-color: ${bgColorValue};
      }
    `}</style>
  );
};
