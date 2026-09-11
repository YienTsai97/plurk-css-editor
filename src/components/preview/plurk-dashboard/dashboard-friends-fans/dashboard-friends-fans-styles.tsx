"use client";

import {
  DASHBOARD_PICS_VISIBLE_DEFAULTS,
} from "@/store/styleManager/defaults";
import { useStyleManager, useStyleProp } from "@/store/styleManager/styleManager";
import { cssValueToString } from "@/store/styleManager/utils/cssValue";
import { useEffect } from "react";
import {
  DASHBOARD_FANS_PICS_SELECTOR,
  DASHBOARD_FRIENDS_PICS_SELECTOR,
} from "./dashboard-friends-fans.constants";

const isPicsHidden = (height: unknown) => {
  const text = cssValueToString(height).trim();
  return text === "0px" || text === "0";
};

/**
 * 用途：註冊好友／粉絲頭像列預設；僅在隱藏時輸出高權重預覽 CSS。
 */
export const DashboardFriendsFansStyles = () => {
  const setInitialBatch = useStyleManager((s) => s.setInitialBatch);

  useEffect(() => {
    setInitialBatch(
      DASHBOARD_FRIENDS_PICS_SELECTOR,
      DASHBOARD_PICS_VISIBLE_DEFAULTS,
    );
    setInitialBatch(
      DASHBOARD_FANS_PICS_SELECTOR,
      DASHBOARD_PICS_VISIBLE_DEFAULTS,
    );
  }, [setInitialBatch]);

  const friendsHeight = useStyleProp(DASHBOARD_FRIENDS_PICS_SELECTOR, "height");
  const friendsOverflow = useStyleProp(
    DASHBOARD_FRIENDS_PICS_SELECTOR,
    "overflow",
  );
  const fansHeight = useStyleProp(DASHBOARD_FANS_PICS_SELECTOR, "height");
  const fansOverflow = useStyleProp(DASHBOARD_FANS_PICS_SELECTOR, "overflow");

  const css = [
    isPicsHidden(friendsHeight.value) &&
      `body#pcg ._lc_ #plurk-dashboard #dash-friends-pics#dash-friends-pics {
        height: ${cssValueToString(friendsHeight.value)};
        overflow: ${cssValueToString(friendsOverflow.value) || "hidden"};
      }`,
    isPicsHidden(fansHeight.value) &&
      `body#pcg ._lc_ #plurk-dashboard #dash-fans-pics#dash-fans-pics {
        height: ${cssValueToString(fansHeight.value)};
        overflow: ${cssValueToString(fansOverflow.value) || "hidden"};
      }`,
  ]
    .filter(Boolean)
    .join("\n");

  if (!css) return null;
  return <style>{css}</style>;
};
