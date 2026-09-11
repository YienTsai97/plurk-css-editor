/** 用途：主控台右鍵依點擊區塊決定要掛哪些條件選單。 */
export type DashboardSectionMenuFlags = {
  showFriendsFans: boolean;
  showKarma: boolean;
};

export const EMPTY_DASHBOARD_SECTION_MENUS: DashboardSectionMenuFlags = {
  showFriendsFans: false,
  showKarma: false,
};

/**
 * 用途：從右鍵 event target 推導區塊旗標（好友／粉絲同組、Karma 獨立）。
 */
export function getDashboardSectionMenuFlags(
  target: EventTarget | null,
): DashboardSectionMenuFlags {
  if (!(target instanceof Element)) return EMPTY_DASHBOARD_SECTION_MENUS;

  return {
    showFriendsFans: Boolean(
      target.closest(".dash-segment-friends, .dash-segment-fans"),
    ),
    showKarma: Boolean(target.closest(".dash-segment-stats")),
  };
}
