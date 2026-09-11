"use client";

import {
  EditorMenuItem,
  EditorMenuSectionLabel,
  EditorMenuSubContent,
  EditorMenuSubTrigger,
} from "@/components/editor/editor-context-menu";
import { ContextMenuSub } from "@/components/ui/context-menu";
import {
  DASHBOARD_KARMA_HIDDEN_COLOR,
  DASHBOARD_KARMA_STATS_HIDDEN_FONT_SIZE,
  DASHBOARD_KARMA_STATS_TD_STYLE_DEFAULTS,
  DASHBOARD_KARMA_STYLE_DEFAULTS,
} from "@/store/styleManager/defaults";
import { useStyleProp } from "@/store/styleManager/styleManager";
import { cssValueToString } from "@/store/styleManager/utils/cssValue";
import {
  DASHBOARD_KARMA_SELECTOR,
  DASHBOARD_KARMA_STATS_TD_SELECTOR,
} from "./dashboard-karma.constants";

/** 用途：右鍵 Karma／統計區時出現——數字透明、副標隱藏。 */
export const DashboardKarmaMenu = () => {
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

  return (
    <ContextMenuSub>
      <EditorMenuSubTrigger>Karma</EditorMenuSubTrigger>
      <EditorMenuSubContent style={{ minWidth: 220 }}>
        <EditorMenuSectionLabel>顯示</EditorMenuSectionLabel>
        <EditorMenuItem
          onSelect={(event) => {
            event.preventDefault();
            color.set(
              colorTransparent
                ? DASHBOARD_KARMA_STYLE_DEFAULTS.color
                : DASHBOARD_KARMA_HIDDEN_COLOR,
            );
          }}
        >
          {colorTransparent ? "✓ Karma 數字透明" : "Karma 數字透明"}
        </EditorMenuItem>
        <EditorMenuItem
          onSelect={(event) => {
            event.preventDefault();
            fontSize.set(
              statsHidden
                ? DASHBOARD_KARMA_STATS_TD_STYLE_DEFAULTS.fontSize
                : DASHBOARD_KARMA_STATS_HIDDEN_FONT_SIZE,
            );
          }}
        >
          {statsHidden ? "✓ 隱藏統計副標數字" : "隱藏統計副標數字"}
        </EditorMenuItem>
      </EditorMenuSubContent>
    </ContextMenuSub>
  );
};
