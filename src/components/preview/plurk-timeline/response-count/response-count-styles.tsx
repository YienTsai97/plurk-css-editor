"use client";

import {
  RESPONSE_COUNT_NEW_STYLE_DEFAULTS,
  RESPONSE_COUNT_STYLE_DEFAULTS,
} from "@/store/styleManager/defaults";
import { useStyleManager, useStyleProp } from "@/store/styleManager/styleManager";
import { cssValueToString } from "@/store/styleManager/utils/cssValue";
import { useEffect } from "react";
import {
  RESPONSE_COUNT_NEW_SELECTOR,
  RESPONSE_COUNT_SELECTOR,
} from "./response-count.constants";

/**
 * 註冊回應數徽章的預設值，並以高權重 `<style>` 即時預覽使用者的自訂樣式。
 *
 * 心法同 `.plurk_cnt`：store 以乾淨選擇器當 key（供匯出），預覽另以 `body#pcg`
 * + 重複 class 拉高權重，蓋過 PostSupplementStyles 的基底樣式。需常駐掛載，
 * 因此與貼文子選單分離（子選單只在開啟時才 portal 渲染）。
 */
export const ResponseCountStyles = () => {
  const setInitialBatch = useStyleManager((s) => s.setInitialBatch);

  /** 用途：註冊匯出 selector 的預設值，讓後續手動修改只輸出 user-changed props。 */
  useEffect(() => {
    setInitialBatch(RESPONSE_COUNT_SELECTOR, RESPONSE_COUNT_STYLE_DEFAULTS);
    setInitialBatch(RESPONSE_COUNT_NEW_SELECTOR, RESPONSE_COUNT_NEW_STYLE_DEFAULTS);
  }, [setInitialBatch]);

  /** 用途：訂閱已讀 selector 的目前值與初始值，用來判斷是否需要生成高權重預覽 CSS。 */
  const bgColor = useStyleProp(RESPONSE_COUNT_SELECTOR, "backgroundColor");
  const color = useStyleProp(RESPONSE_COUNT_SELECTOR, "color");
  const borderRadius = useStyleProp(RESPONSE_COUNT_SELECTOR, "borderRadius");

  /** 用途：訂閱未讀 selector 的目前值與初始值，僅處理 `.new` 狀態的顏色覆寫。 */
  const newBgColor = useStyleProp(RESPONSE_COUNT_NEW_SELECTOR, "backgroundColor");
  const newColor = useStyleProp(RESPONSE_COUNT_NEW_SELECTOR, "color");

  /** 用途：把有變更的 props 轉成高權重 CSS，避免被基礎 Plurk 預覽樣式蓋掉。 */
  const css = [
    bgColor.value !== bgColor.initial &&
      `body#pcg .timeline-cnt .response_count.response_count { background-color: ${cssValueToString(bgColor.value)}; }`,
    color.value !== color.initial &&
      `body#pcg .timeline-cnt .response_count.response_count { color: ${cssValueToString(color.value)}; }`,
    borderRadius.value !== borderRadius.initial &&
      `body#pcg .timeline-cnt .response_count.response_count { border-radius: ${cssValueToString(borderRadius.value)}; }`,
    newBgColor.value !== newBgColor.initial &&
      `body#pcg .timeline-cnt .new .response_count.response_count { background-color: ${cssValueToString(newBgColor.value)}; }`,
    newColor.value !== newColor.initial &&
      `body#pcg .timeline-cnt .new .response_count.response_count { color: ${cssValueToString(newColor.value)}; }`,
  ]
    .filter(Boolean)
    .join("\n");

  if (!css) return null;

  return <style>{css}</style>;
};
