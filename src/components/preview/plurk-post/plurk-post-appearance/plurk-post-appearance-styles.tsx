"use client";

import { PLURK_POST_STYLE_DEFAULTS } from "@/store/styleManager/defaults";
import { useStyleManager, useStyleProp } from "@/store/styleManager/styleManager";
import { cssValueToString } from "@/store/styleManager/utils/cssValue";
import { useEffect } from "react";
import {
  PLURK_POST_NAME_SELECTOR,
  PLURK_POST_SELECTOR,
} from "./plurk-post-appearance.constants";

/**
 * 用途：貼文外觀 feature 的常駐樣式層。
 *
 * store 使用乾淨 selector 供匯出，預覽則使用 body#pcg + 重複 class 拉高權重，
 * 避免被 `PostStaticStyles` 內的預設 `.plurk_cnt` 樣式蓋掉。
 */
export const PlurkPostAppearanceStyles = () => {
  const setInitialBatch = useStyleManager((s) => s.setInitialBatch);

  /** 用途：註冊貼文主體可編輯樣式的預設值；手動改動才會輸出到 CSS。 */
  useEffect(() => {
    setInitialBatch(PLURK_POST_SELECTOR, PLURK_POST_STYLE_DEFAULTS);
  }, [setInitialBatch]);

  /** 用途：訂閱貼文主體樣式，用來判斷是否需要產生高權重預覽 CSS。 */
  const bgColor = useStyleProp(PLURK_POST_SELECTOR, "backgroundColor");
  const bgImage = useStyleProp(PLURK_POST_SELECTOR, "backgroundImage");
  const border = useStyleProp(PLURK_POST_SELECTOR, "border");
  const borderRadius = useStyleProp(PLURK_POST_SELECTOR, "borderRadius");

  /** 用途：保留舊流程對 `.name` 匯入/手動 color 的高權重預覽能力。 */
  const nameColor = useStyleProp(PLURK_POST_NAME_SELECTOR, "color");

  const bgColorChanged = bgColor.value !== bgColor.initial;
  const bgImageChanged = bgImage.value !== bgImage.initial;
  const borderChanged = border.value !== border.initial;
  const borderRadiusChanged = borderRadius.value !== borderRadius.initial;
  const nameColorChanged = nameColor.value !== nameColor.initial;

  const css = [
    bgColorChanged &&
      `body#pcg .plurk_cnt.plurk_cnt.plurk_cnt { background-color: ${cssValueToString(bgColor.value)}; }`,
    bgImageChanged &&
      `body#pcg .plurk_cnt.plurk_cnt.plurk_cnt { background-image: ${cssValueToString(bgImage.value)}; }`,
    borderChanged &&
      `body#pcg .plurk_cnt.plurk_cnt.plurk_cnt { border: ${cssValueToString(border.value)}; }`,
    borderRadiusChanged &&
      `body#pcg .plurk_cnt.plurk_cnt.plurk_cnt { border-radius: ${cssValueToString(borderRadius.value)}; }`,
    nameColorChanged &&
      `body#pcg .name.name.name { color: ${cssValueToString(nameColor.value)}; }`,
  ]
    .filter(Boolean)
    .join("\n");

  if (!css) return null;

  return <style>{css}</style>;
};
