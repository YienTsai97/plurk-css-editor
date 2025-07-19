import { PlurkDashboard } from "@/components/preview/plurk-dashboard";
import { PlurkTimeline } from "@/components/preview/plurk-timeline";
import PlurkTimelineControl from "@/components/preview/plurk-timeline-control";
import { PlurkTopBar } from "@/components/preview/plurk-top-bar";

const PlurkPreviewPage = () => (
  <div className="html5 language-large-font timeline">
    <div id="layout_body">
      <PlurkTopBar />
      <div id="layout_content_html" className="_lch_">
        <div id="layout_content" className="_lc_ clearfix">
          <PlurkTimeline />
          <PlurkTimelineControl />
          <PlurkDashboard />
        </div>
      </div>
    </div>
  </div>
);

export default PlurkPreviewPage;