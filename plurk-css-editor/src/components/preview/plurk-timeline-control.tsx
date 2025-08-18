import Image from "next/image";

const PlurkTimelineControl = () => {
  return (
    <>
      <style>
        {`
.timeline_control {
    z-index: 1001;
    position: absolute;
    width: 100%;
    margin-left: 16px;
    margin-top: -46px;
    height: 25px;
    pointer-events: none;
}
#timeline_control_holder {
    position: absolute;
    bottom: 0;
}
#filter_tab {
    pointer-events: auto;
    float: right;
    width: 119px
}
#filter_tab i {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    gap: 4px;
    margin-right: 4px;
}
#filter_tab a {
    display: block;
    overflow: hidden;
    background: #FFF;
    color: #999;
    margin-top: 0;
    height: 0;
    transition: height 200ms ease-in, margin-top 200ms ease-in;
    cursor: pointer;
    padding: 0 12px;
    opacity: 0.9;
}
#filter_tab a.filter_selected {
    color: #FFF;
    background: #FF574D;
}
.timeline_control a {
    border-radius: 5px;
    padding: 0 8px;
    text-decoration: none;
    text-align: center;
    line-height: 25px;
    white-space: nowrap;
}
#filter_tab:hover a, #filter_tab a.filter_selected, #filter_tab a.has_unread, #filter_tab:hover a.filter_selected, #filter_tab:hover a.has_unread {
    height: 25px;
    margin-top: 6px;
}
.timeline_control a i {
    opacity: 0.8;
    width: 18px;
    margin-right: 4px;
}

      `}
      </style>
      <div className="timeline_control">
        <div id="timeline_control_holder">
          <ul id="filter_tab">
            {/* <li>
              <a title="瀏覽您按過喜歡的訊息" className="off_tab" id="favorite_plurks_tab_btn">
                <i className="pif-like"></i>喜歡的訊息
                <span id="count_favorite_plurks"></span>
              </a>
            </li>
            <li>
              <a title="瀏覽您轉噗過的訊息" className="off_tab" id="replurked_plurks_tab_btn">
                <i className="pif-replurk"></i>轉噗的訊息<span id="count_replurked_plurks"></span></a></li>
            <li>
              <a title="瀏覽您回應過的訊息" className="off_tab" id="responded_plurks_tab_btn">
                <i className="pif-message"></i>回應過的訊息
                <span id="count_responded_plurks"></span>
              </a>
            </li>
            <li>
              <a title="瀏覽您的私人訊息" className="off_tab" id="private_plurks_tab_btn">
                <i className="pif-message-private"></i>私人訊息<span id="count_private_plurks"></span>
              </a>
            </li>
            <li>
              <a title="瀏覽您發表的訊息" className="off_tab" id="own_plurks_tab_btn">
                <i className="pif-message-my">
                </i>我發表的訊息
                <span id="count_my_plurks"></span>
              </a>
            </li>*/}
            <li>
              <a className="filter_selected bottom_line_bg" title="瀏覽所有訊息" id="all_plurks">
                <i className="pif-messages">
                  <Image
                    src={"/chats_icon.png"}
                    width={15}
                    height={15}
                    alt="look"
                  />
                  <span>所有訊息</span>
                </i>
                <span id="count_all_plurk"></span>
              </a>
            </li>
          </ul>
          <div id="updater" style={{ visibility: "visible" }}>
            {/* <div id="noti_np" className="item" style={{ display: "none" }}>
              <a>
                <i className="pif-message-new">
                </i>
                <span id="noti_np_text">新訊息</span>
                <span id="noti_np_count" className="unread_generic"></span>
              </a>
            </div> */}
            <div id="noti_re" className="item" style={{ display: "none" }}>
              <div id="noti_re_view" className="item" style={{ display: "none" }}>
                <a>
                  <i className="pif-message-new">
                  </i>
                  <span id="noti_re_text">檢視未讀訊息</span>
                  <span id="noti_re_count" className="unread_generic"></span>
                </a>
              </div>
              {/* <div className="item" id="noti_re_actions" style={{ display: "none" }}>
                <a className="updater_link" id="mark_all_link">
                  <i className="pif-check"></i>
                  <span>全部標為已讀</span></a>
                <a className="updater_link" id="view_all_plurk">
                  <i className="pif-cancel"></i>
                  <span>顯示所有訊息</span>
                </a>
              </div> */}
            </div>
            {/* <div id="noti_pp" className="item" style={{ display: "none" }}>
              <a>
                <i className="pif-message-new"></i>
                <span id="noti_pp_text">查看置頂訊息</span>
              </a>
            </div> */}
          </div>
        </div>
      </div >
    </>
  )
}

export default PlurkTimelineControl