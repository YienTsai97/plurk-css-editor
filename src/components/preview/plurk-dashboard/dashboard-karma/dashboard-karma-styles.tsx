"use client";

import {
  DASHBOARD_KARMA_HIDDEN_COLOR,
  DASHBOARD_KARMA_STATS_HIDDEN_FONT_SIZE,
  DASHBOARD_KARMA_STATS_TD_STYLE_DEFAULTS,
  DASHBOARD_KARMA_STYLE_DEFAULTS,
} from "@/store/styleManager/defaults";
import { useStyleManager, useStyleProp } from "@/store/styleManager/styleManager";
import { cssValueToString } from "@/store/styleManager/utils/cssValue";
import { useEffect } from "react";
import {
  DASHBOARD_KARMA_SELECTOR,
  DASHBOARD_KARMA_STATS_TD_SELECTOR,
} from "./dashboard-karma.constants";

/**
 * 用途：註冊 Karma／副標預設；僅在「透明／隱藏」啟用時輸出高權重預覽。
 */
export const DashboardKarmaStyles = () => {
  const setInitialBatch = useStyleManager((s) => s.setInitialBatch);

  useEffect(() => {
    setInitialBatch(DASHBOARD_KARMA_SELECTOR, DASHBOARD_KARMA_STYLE_DEFAULTS);
    setInitialBatch(
      DASHBOARD_KARMA_STATS_TD_SELECTOR,
      DASHBOARD_KARMA_STATS_TD_STYLE_DEFAULTS,
    );
  }, [setInitialBatch]);

  const color = useStyleProp(DASHBOARD_KARMA_SELECTOR, "color");
  const fontSize = useStyleProp(DASHBOARD_KARMA_STATS_TD_SELECTOR, "fontSize");

  const colorValue = cssValueToString(color.value).trim();
  const fontSizeValue = cssValueToString(fontSize.value).trim();
  const colorTransparent =
    colorValue === DASHBOARD_KARMA_HIDDEN_COLOR || colorValue === "transparent";
  const statsHidden =
    fontSizeValue === DASHBOARD_KARMA_STATS_HIDDEN_FONT_SIZE ||
    fontSizeValue === "0px" ||
    fontSizeValue === "0";

  const css = [
    colorTransparent &&
      `body#pcg ._lc_ #plurk-dashboard #karma#karma {
        color: ${DASHBOARD_KARMA_HIDDEN_COLOR};
      }`,
    statsHidden &&
      `body#pcg ._lc_ #plurk-dashboard #dash-stats table td {
        font-size: ${DASHBOARD_KARMA_STATS_HIDDEN_FONT_SIZE};
      }`,
  ]
    .filter(Boolean)
    .join("\n");

  if (!css) return null;
  return <style>{css}</style>;
};
