import PlurkTimelinePosts from "./plurk-timeline-posts";

export const PlurkTimeline = () => {
  return (
    <>
      <style>
        {`
        .timeline-holder {
          padding: 0 !important;
          overflow: visible;
          height: 72vh;
          min-height: 386px;
          max-height: 820px;
          position: relative;
          width: 100%;
          cursor: move;
        }
        .timeline-cnt{
          position: absolute;
          height: 100% !important;
          width: 100%;
          left: 0;
          top: 0;
          overflow: visible !important;
        }
        .browse_button{
          position: absolute;
          z-index: 5000;
        }
        .cmp_arrow_right{
          right: 10px;
          top: 35%;
        }
          .cmp_back_to_today{
          font-size: 12px;
          line-height: 18px;
          margin-top: 10px;
          background-color: #FF574D;
          color:#FFFF;
          border-radius: 10px;
          position: absolute;
          margin-left: 11px;
          padding: 0px 9px;
        }
        .cmp_back_to_today:before {
          content: "";
          display: inline-block;
          width: 12px;
          height: 12px;
          background: url('data:image/svg+xml;utf8,<svg viewBox="0 0 700 649.8" xmlns="http://www.w3.org/2000/svg"><path  fill="%23FF574D" d="M686.1,293.2L522.8,133L394.4,12.3c-25.5-24-67.3-5.9-67.3,29.1v159.8v15.7l-237.7,0.7c-47.5,0.1-85.9,38.7-85.9,86.2v44v16.4c0,47.6,38.6,86.2,86.2,86.2H327v159.8c0,35,41.8,53.1,67.3,29.1l128.4-120.7l163.3-160.2c9.2-9,13.8-20.8,13.8-32.7C699.9,314,695.3,302.2,686.1,293.2z"/></svg>');
          background-size: contain;
          background-repeat: no-repeat;
          transform: rotate(180deg);
          position: absolute;
          margin-left: -19px;
          margin-top: 4px;
        }
        .timeline-cnt, .timeline-bg, .timeline-cnt .block_cnt, .timeline-bg .block_bg {
          position: absolute;
          height: 100% !important;
          width: 100%;
          left: 0;
          top: 0;
          overflow: visible !important;
        }
        ._lc_ .timeline-bg {
          //background-color: #000;
          //background-image: url(https://images.plurk.com/68NDxQEGFWDhWS1QOqI1ny.png);
          background-size: 50px;
          background-repeat: repeat-x;
          background-position: bottom;
        }
        .bottom-line {
          width: 100%;
          position: absolute;
          background-color: #FFF;
          height: 2px;
          z-index: -100;
          overflow: hidden;
          bottom: -1px;
        }
                  #dynamic_logo{
          cursor: move;
          position: absolute;
          z-index: 10;
          margin-top: 12px;
          white-space: nowrap;
          right: 10px;
          display: inline-block;
        }
      `}
      </style>
      <div className="timeline-holder" id="timeline_holder">
        <div
          className="timeline-cnt"
          id="timeline_cnt"
          style={{ paddingBottom: "0px" }}
        >
          <div
            className="block_cnt"
            style={{ left: "0px", height: "100% !important", width: "0px" }}
          >
            <PlurkTimelinePosts />
          </div>
        </div>
        <div
          className="timeline-bg"
          id="timeline_bg"
          style={{ paddingBottom: "0px" }}
        >
          <div
            id="bottom_line"
            className="bottom-line"
            style={{ display: "block" }}
          ></div>
          <div
            className="block_bg"
            style={{ left: "0px", height: "100% !important", width: "0px" }}
          ></div>
        </div>
        <div
          className="timeline-timeshow morning"
          id="time_show"
          style={{ display: "none" }}
        ></div>
        <div className="browse_button" style={{ right: "10px", top: "35%" }}>
          <div
            className="cmp_arrow_right pif-arrow-right"
            style={{ color: "#FF574D" }}
          >
            <svg
              version="1.1"
              id="arrow-right"
              width="56px"
              height="56px"
              viewBox="0 0 700 649.8"
            >
              <path
                fill="currentColor"
                d="M686.1,293.2L522.8,133L394.4,12.3c-25.5-24-67.3-5.9-67.3,29.1v159.8v15.7l-237.7,0.7c-47.5,0.1-85.9,38.7-85.9,86.2v44v16.4c0,47.6,38.6,86.2,86.2,86.2H327v159.8c0,35,41.8,53.1,67.3,29.1l128.4-120.7l163.3-160.2c9.2-9,13.8-20.8,13.8-32.7C699.9,314,695.3,302.2,686.1,293.2z"
              />
            </svg>
          </div>
          <div className="cmp_back_to_today pif-arrow-left">Begin</div>
        </div>
        <div id="dynamic_logo">
          <img
            id="creature"
            src="/creature1.png"
            alt="creature"
            style={{ width: "auto", height: "auto" }}
          />
        </div>
      </div>
    </>
  );
};