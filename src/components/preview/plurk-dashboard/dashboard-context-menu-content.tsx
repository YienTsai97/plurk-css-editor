import { EditorMenuTitle } from "@/components/editor/editor-context-menu";
import { DashboardFriendsFansMenu } from "./dashboard-friends-fans/dashboard-friends-fans-menu";
import { DashboardKarmaMenu } from "./dashboard-karma/dashboard-karma-menu";
import { DashboardSegmentMenu } from "./dashboard-segment/dashboard-segment-menu";
import type { DashboardSectionMenuFlags } from "./dashboard-section-menu-flags";
import { DashboardShellMenu } from "./dashboard-shell/dashboard-shell-menu";

type DashboardContextMenuContentProps = {
  sectionMenus: DashboardSectionMenuFlags;
};

/** 用途：主控台右鍵——常設外殼／各區塊；依點擊區再掛好友粉絲或 Karma。 */
export const DashboardContextMenuContent = ({
  sectionMenus,
}: DashboardContextMenuContentProps) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <EditorMenuTitle>主控台設置</EditorMenuTitle>
      <DashboardShellMenu />
      <DashboardSegmentMenu />

      {(sectionMenus.showFriendsFans || sectionMenus.showKarma) && (
        <>
          <EditorMenuTitle>特殊區塊</EditorMenuTitle>
          {sectionMenus.showFriendsFans && <DashboardFriendsFansMenu />}
          {sectionMenus.showKarma && <DashboardKarmaMenu />}
        </>
      )}
    </div>
  );
};
