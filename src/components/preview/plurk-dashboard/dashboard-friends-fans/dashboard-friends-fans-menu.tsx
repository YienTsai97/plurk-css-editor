"use client";

import {
  EditorMenuItem,
  EditorMenuSectionLabel,
  EditorMenuSubContent,
  EditorMenuSubTrigger,
} from "@/components/editor/editor-context-menu";
import { ContextMenuSub } from "@/components/ui/context-menu";
import {
  DASHBOARD_PICS_HIDDEN_VALUES,
  DASHBOARD_PICS_VISIBLE_DEFAULTS,
} from "@/store/styleManager/defaults";
import { useStyleProp } from "@/store/styleManager/styleManager";
import { cssValueToString } from "@/store/styleManager/utils/cssValue";
import {
  DASHBOARD_FANS_PICS_SELECTOR,
  DASHBOARD_FRIENDS_PICS_SELECTOR,
} from "./dashboard-friends-fans.constants";

const isPicsHidden = (height: unknown) => {
  const text = cssValueToString(height).trim();
  return text === "0px" || text === "0";
};

/** 用途：右鍵好友／粉絲區時出現——隱藏頭像列但保留加入按鈕。 */
export const DashboardFriendsFansMenu = () => {
  const friendsHeight = useStyleProp(DASHBOARD_FRIENDS_PICS_SELECTOR, "height");
  const friendsOverflow = useStyleProp(
    DASHBOARD_FRIENDS_PICS_SELECTOR,
    "overflow",
  );
  const fansHeight = useStyleProp(DASHBOARD_FANS_PICS_SELECTOR, "height");
  const fansOverflow = useStyleProp(DASHBOARD_FANS_PICS_SELECTOR, "overflow");

  const friendsHidden = isPicsHidden(friendsHeight.value);
  const fansHidden = isPicsHidden(fansHeight.value);

  return (
    <ContextMenuSub>
      <EditorMenuSubTrigger>好友與粉絲</EditorMenuSubTrigger>
      <EditorMenuSubContent style={{ minWidth: 220 }}>
        <EditorMenuSectionLabel>頭像列</EditorMenuSectionLabel>
        <EditorMenuItem
          onSelect={(event) => {
            event.preventDefault();
            if (friendsHidden) {
              friendsHeight.set(DASHBOARD_PICS_VISIBLE_DEFAULTS.height);
              friendsOverflow.set(DASHBOARD_PICS_VISIBLE_DEFAULTS.overflow);
            } else {
              friendsHeight.set(DASHBOARD_PICS_HIDDEN_VALUES.height);
              friendsOverflow.set(DASHBOARD_PICS_HIDDEN_VALUES.overflow);
            }
          }}
        >
          {friendsHidden ? "✓ 隱藏好友頭像列" : "隱藏好友頭像列"}
        </EditorMenuItem>
        <EditorMenuItem
          onSelect={(event) => {
            event.preventDefault();
            if (fansHidden) {
              fansHeight.set(DASHBOARD_PICS_VISIBLE_DEFAULTS.height);
              fansOverflow.set(DASHBOARD_PICS_VISIBLE_DEFAULTS.overflow);
            } else {
              fansHeight.set(DASHBOARD_PICS_HIDDEN_VALUES.height);
              fansOverflow.set(DASHBOARD_PICS_HIDDEN_VALUES.overflow);
            }
          }}
        >
          {fansHidden ? "✓ 隱藏粉絲頭像列" : "隱藏粉絲頭像列"}
        </EditorMenuItem>
      </EditorMenuSubContent>
    </ContextMenuSub>
  );
};
