"use client";

import { EditorMenuContent } from "@/components/editor/editor-context-menu";
import {
  ContextMenu,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useState } from "react";
import { DashboardContextMenuContent } from "./dashboard-context-menu-content";
import DashboardLeft from "./dashboard-left";
import DashboardRight from "./dashboard-right";
import {
  EMPTY_DASHBOARD_SECTION_MENUS,
  getDashboardSectionMenuFlags,
  type DashboardSectionMenuFlags,
} from "./dashboard-section-menu-flags";

export const PlurkDashboard = () => {
  const [sectionMenus, setSectionMenus] = useState<DashboardSectionMenuFlags>(
    EMPTY_DASHBOARD_SECTION_MENUS,
  );

  return (
    <>
      <style>
        {`
#dashboard_holder {
    width: 98%;
    max-width: 980px;
    min-width: 580px;
    position: relative;
    margin: 0 auto 21px;
    padding: 35px 0 20px;
}
    #plurk-dashboard {
    color: #666;
    overflow: visible;
    line-height: 15px;
    height: 1%;
    width: 100%;
}
#plurk-dashboard a {
    color: #E88D43;
}
/* .segment-content 背景／圓角／padding／上邊距改由 DashboardSegmentStyles 常駐輸出 */
#plurk-dashboard:after, .segment-content:after {
    content: '';
    clear: both;
    width: 0;
    height: 0;
    display: block;
    line-height: 0;
    font-size: 0;
}
    #plurk-dashboard .dash-group-left {
    float: left;
    width: 33%;
    position: relative;
    padding-right: 10px;
}
#plurk-dashboard .dash-group-form, #plurk-dashboard .dash-group-right {
    float: right;
    width: 67%;
    position: relative;
}
#plurk-dashboard .dash-segment-profile #dash-additional-info #location_container, #plurk-dashboard .dash-segment-profile #dash-additional-info #relationship_container {
    margin-top: 10px;
}
body.language-large-font .friend_man {
    font-size: 12px;
}
.pif-follow_add.add_follow{
  display: flex;
  align-items: center;
  gap: 4px;
  width:fit-content;
}

    // Form
#plurk-dashboard .dash-group-form .segment-content {
    min-height: 96px;
    overflow: visible;
}
p {
    display: block;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    unicode-bidi: isolate;
}
#plurk-dashboard .dash-segment-post, #plurk-dashboard .dash-segment-stats {
    width: 100%;
}
    #plurk-dashboard .dash-segment {
    float: left;
    position: relative;
}


        `}
      </style>
      <div id="dashboard_holder">
        {" "}
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <div
              id="plurk-dashboard"
              className="own"
              onContextMenu={(event) => {
                setSectionMenus(getDashboardSectionMenuFlags(event.target));
              }}
            >
              <DashboardLeft />
              <DashboardRight />
            </div>
          </ContextMenuTrigger>
          <EditorMenuContent>
            <DashboardContextMenuContent sectionMenus={sectionMenus} />
          </EditorMenuContent>
        </ContextMenu>
      </div>
    </>
  );
};
