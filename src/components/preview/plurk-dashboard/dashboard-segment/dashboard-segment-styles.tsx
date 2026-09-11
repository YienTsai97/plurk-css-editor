"use client";

import {
  DASHBOARD_SEGMENT_STYLE_DEFAULTS,
} from "@/store/styleManager/defaults";
import { useStyleManager, useStyleProp } from "@/store/styleManager/styleManager";
import { cssValueToString } from "@/store/styleManager/utils/cssValue";
import { useEffect } from "react";
import { DASHBOARD_SEGMENT_SELECTOR } from "./dashboard-segment.constants";

/**
 * 用途：註冊各區塊白圓角預設，並常駐輸出預覽 CSS（取代 plurk-dashboard 寫死值）。
 */
export const DashboardSegmentStyles = () => {
  const setInitialBatch = useStyleManager((s) => s.setInitialBatch);

  useEffect(() => {
    setInitialBatch(DASHBOARD_SEGMENT_SELECTOR, DASHBOARD_SEGMENT_STYLE_DEFAULTS);
  }, [setInitialBatch]);

  const bgColor = useStyleProp(DASHBOARD_SEGMENT_SELECTOR, "backgroundColor");
  const border = useStyleProp(DASHBOARD_SEGMENT_SELECTOR, "border");
  const padding = useStyleProp(DASHBOARD_SEGMENT_SELECTOR, "padding");
  const borderRadius = useStyleProp(DASHBOARD_SEGMENT_SELECTOR, "borderRadius");
  const marginTop = useStyleProp(DASHBOARD_SEGMENT_SELECTOR, "marginTop");

  const bgColorValue =
    cssValueToString(bgColor.value) ||
    DASHBOARD_SEGMENT_STYLE_DEFAULTS.backgroundColor;
  const borderValue =
    cssValueToString(border.value) || DASHBOARD_SEGMENT_STYLE_DEFAULTS.border;
  const paddingValue =
    cssValueToString(padding.value) || DASHBOARD_SEGMENT_STYLE_DEFAULTS.padding;
  const borderRadiusValue =
    cssValueToString(borderRadius.value) ||
    DASHBOARD_SEGMENT_STYLE_DEFAULTS.borderRadius;
  const marginTopValue =
    cssValueToString(marginTop.value) ||
    DASHBOARD_SEGMENT_STYLE_DEFAULTS.marginTop;

  return (
    <style>{`
      body#pcg ._lc_ #plurk-dashboard .dash-segment:not(.dash-segment-award) .segment-content.segment-content {
        background-color: ${bgColorValue};
        border: ${borderValue};
        padding: ${paddingValue};
        border-radius: ${borderRadiusValue};
        margin-top: ${marginTopValue};
      }
    `}</style>
  );
};
