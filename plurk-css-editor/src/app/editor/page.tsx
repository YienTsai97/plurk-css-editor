import { PlurkDashboard } from "@/components/preview/plurk-dashboard/plurk-dashboard";
import { PlurkFooter } from "@/components/preview/plurk-footer";
import { PlurkTimeline } from "@/components/preview/plurk-timeline";
import PlurkTimelineControl from "@/components/preview/plurk-timeline-control";
import { PlurkTopBar } from "@/components/preview/plurk-top-bar";

const PlurkPreviewPage = () => (
  <>
    <style>
      {`

      body {
    background: #eeebf0;
    color: #333;
}
    body.language-large-font {
    font-size: 13px;
}
    body, #layout_content_html, #layout_content {
    overflow-x: hidden;
}
body {
    overflow-y: scroll;
}
        body, div, dl, dt, dd, ul, ol, li, h1, h2, h3, h4, h5, h6, pre, code, form, fieldset, legend, input, textarea, p, blockquote, th, td {
          margin: 0;
          padding: 0;
        }
        // a {
        //   color: #FF574D;
        //   text-decoration: none;
        //   cursor: pointer;
        // }
        body.language-large-font {
          font-size: 13px;
        }
        #layout_content {
          padding-top: 42px;
          position: relative;
        }
        .clearfix {
    clear: both;
}
    .clearfix::after {
    content: '';
    clear: both;
    width: 0px;
    height: 0px;
    display: block;
    line-height: 0px;
    font-size: 0px;
}
i {
    font-style: normal;
}
      `}
    </style>
    <div id="layout_body">
      <PlurkTopBar />
      <div id="layout_content_html" className="_lch_">
        <div id="layout_content" className="_lc_ clearfix">
          <PlurkTimeline />
          <PlurkTimelineControl />
          <PlurkDashboard />
          <PlurkFooter />
        </div>
      </div>
    </div>
  </>
);

export default PlurkPreviewPage;