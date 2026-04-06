"use client";
import DashboardLeft from "./dashboard-left";
import DashboardRight from "./dashboard-right";

export const PlurkDashboard = () => {
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
.dash-segment .segment-content {
    background: #FFF;
    margin-top: 10px;
    padding: 5px;
    border-radius: 10px;
}
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
        <div id="plurk-dashboard" className="own">
          {/* <div className="dash-group-form">
          <div className="dash-segment dash-segment-post">
            <div className="segment-content">
              <div id="plurk_form" style={{ display: "block" }}>
                <form className="plurkaction pane" action="/" onSubmit={() => false} id="pane_plurk">
                  <div id="main_poster">
                    <div className="plurkForm">
                      <div className="drop_indicator">拖放圖片到此上傳</div>
                      <div className="click submit_img submit_img_color" data-qual="freestyle">Plurk</div>
                      <div className="input_holder">
                        <div className="qual_holder"><div className="dd_img m_qualifier q_freestyle" data-qual="freestyle">
                          <span style={{ display: "none" }}></span><i className="pif-dropdown"></i>
                        </div>
                        </div>
                        <div className="textarea_holder">
                          <textarea name="content" className="content" id="input_big" style={{ height: "37px" }}></textarea>
                        </div>
                        <div className="share_holder"><div className="preview-list" style={{ display: "none" }}><ul><li className="add_photo">+</li></ul>
                          <input name="image" type="file" accept="image/*" multiple style={{ opacity: 0, visibility: "hidden", display: "none" }} /></div></div>
                      </div>
                      <ul className="icons_holder">
                        <li className="cmp_emoticon_off pif-emoticon"></li>
                        <li className="cmp_media_off pif-media"></li>
                        <li className="cmp_anynomous_off pif-anynomous"></li>
                        <li className="cmp_poll_off pif-poll"></li><li className="cmp_privacy_off pif-privacy"></li>
                      </ul>
                      <div className="plurk_to">
                        <span className="plurk-to-privacy pif-privacy hide"></span>
                        <span className="plurk-to-response pif-message-private hide"></span>
                        <span className="plurk-to-replurk pif-follow-replurk-cancel hide">不可轉噗</span>
                        <span className="plurk-to-porn pif-porn hide">成人內容</span>
                        <span className="plurk-to-anonymous pif-info hide"><a href="/anonymous-rule" target="_blank">發文規則</a></span>
                      </div>
                      <div className="char_updater"></div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div> */}
          <DashboardLeft />
          <DashboardRight />
        </div>
      </div >
    </>
  );
};
