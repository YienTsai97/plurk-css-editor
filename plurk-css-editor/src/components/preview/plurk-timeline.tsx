export const PlurkTimeline = () => {
  return (
    <div
      className="timeline-holder"
      id="timeline_holder"
      style={{ height: "502px" }}
    >
      <div
        className="timeline-message"
        id="empty_timeline_fg"
      // style={{ marginTop: "-105px" }}
      >
        您可以透過底下的框框開始輸入您要分享的噗浪訊息。
        <br />
        <br />
        祝您噗浪愉快！
      </div>
      <div
        className="timeline-cnt"
        id="timeline_cnt"
        style={{ paddingBottom: "0px" }}
      >
        <div
          className="block_cnt"
          style={{ left: "0px", height: "100% !important", width: "0px" }}
        ></div>
        <div className="block_cnt" style={{ display: "none" }}></div>
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
      <div
        className="browse_button"
        style={{ right: "10px", top: "35%" }}
      >
        <div className="cmp_arrow_right pif-arrow-right"></div>
        <div className="cmp_back_to_today pif-arrow-left">Begin</div>
      </div>
      <div
        className="browse_button"
        style={{ left: "10px", top: "35%", display: "none" }}
      >
        <div className="cmp_arrow_left pif-arrow-left"></div>
        <div className="cmp_back_to_today pif-arrow-left">Begin</div>
      </div>
      <div id="dynamic_logo">
        <img
          id="creature"
          src="https://s.plurk.com/creatures/big/72e28d113423eccdc548.png"
          alt="creature"
        />
      </div>
    </div>
  );
};
