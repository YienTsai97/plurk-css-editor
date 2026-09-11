"use client";

import {
  DASHBOARD_SHELL_HOVER_STYLE_DEFAULTS,
  DASHBOARD_SHELL_STYLE_DEFAULTS,
} from "@/store/styleManager/defaults";
import { useStyleManager, useStyleProp } from "@/store/styleManager/styleManager";
import { cssValueToString } from "@/store/styleManager/utils/cssValue";
import { useEffect } from "react";
import {
  DASHBOARD_SHELL_HOVER_SELECTOR,
  DASHBOARD_SHELL_SELECTOR,
} from "./dashboard-shell.constants";

/**
 * 用途：註冊主控台外殼平常／hover 透明度、背景色、邊框、內距、透明度動畫，並常駐輸出預覽 CSS。
 */
export const DashboardShellStyles = () => {
  const setInitialBatch = useStyleManager((s) => s.setInitialBatch);

  useEffect(() => {
    setInitialBatch(DASHBOARD_SHELL_SELECTOR, DASHBOARD_SHELL_STYLE_DEFAULTS);
    setInitialBatch(
      DASHBOARD_SHELL_HOVER_SELECTOR,
      DASHBOARD_SHELL_HOVER_STYLE_DEFAULTS,
    );
  }, [setInitialBatch]);

  const opacity = useStyleProp(DASHBOARD_SHELL_SELECTOR, "opacity");
  const backgroundColor = useStyleProp(
    DASHBOARD_SHELL_SELECTOR,
    "backgroundColor",
  );
  const transition = useStyleProp(DASHBOARD_SHELL_SELECTOR, "transition");
  const border = useStyleProp(DASHBOARD_SHELL_SELECTOR, "border");
  const borderRadius = useStyleProp(DASHBOARD_SHELL_SELECTOR, "borderRadius");
  const padding = useStyleProp(DASHBOARD_SHELL_SELECTOR, "padding");
  const hoverOpacity = useStyleProp(DASHBOARD_SHELL_HOVER_SELECTOR, "opacity");

  const opacityValue =
    cssValueToString(opacity.value) || DASHBOARD_SHELL_STYLE_DEFAULTS.opacity;
  const bgColorValue =
    cssValueToString(backgroundColor.value) ||
    DASHBOARD_SHELL_STYLE_DEFAULTS.backgroundColor;
  const transitionValue =
    cssValueToString(transition.value) ||
    DASHBOARD_SHELL_STYLE_DEFAULTS.transition;
  const borderValue =
    cssValueToString(border.value) || DASHBOARD_SHELL_STYLE_DEFAULTS.border;
  const borderRadiusValue =
    cssValueToString(borderRadius.value) ||
    DASHBOARD_SHELL_STYLE_DEFAULTS.borderRadius;
  const paddingValue =
    cssValueToString(padding.value) || DASHBOARD_SHELL_STYLE_DEFAULTS.padding;
  const hoverOpacityValue =
    cssValueToString(hoverOpacity.value) ||
    DASHBOARD_SHELL_HOVER_STYLE_DEFAULTS.opacity;

  return (
    <style>{`
      body#pcg ._lc_ #plurk-dashboard#plurk-dashboard {
        opacity: ${opacityValue};
        background-color: ${bgColorValue};
        transition: ${transitionValue};
        border: ${borderValue};
        border-radius: ${borderRadiusValue};
        padding: ${paddingValue};
      }
      body#pcg ._lc_ #plurk-dashboard#plurk-dashboard:hover {
        opacity: ${hoverOpacityValue};
      }
    `}</style>
  );
};
