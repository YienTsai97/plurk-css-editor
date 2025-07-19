const PlurkTimelineControl = () => {
  return (
    <div className="timeline_control">
      <div id="timeline_control_holder">
        <ul id="filter_tab">
          <li>
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
          </li>
          <li>
            <a className="filter_selected bottom_line_bg" title="瀏覽所有訊息" id="all_plurks">
              <i className="pif-messages"></i>所有訊息
              <span id="count_all_plurk"></span>
            </a>
          </li>
        </ul>
        <div id="updater" style={{ visibility: "visible" }}>
          <div id="noti_np" className="item" style={{ display: "none" }}>
            <a>
              <i className="pif-message-new">
              </i>
              <span id="noti_np_text">新訊息</span>
              <span id="noti_np_count" className="unread_generic"></span>
            </a>
          </div>
          <div id="noti_re" className="item" style={{ display: "none" }}>
            <div id="noti_re_view" className="item" style={{ display: "none" }}>
              <a>
                <i className="pif-message-new">
                </i>
                <span id="noti_re_text">檢視未讀訊息</span>
                <span id="noti_re_count" className="unread_generic"></span>
              </a>
            </div>
            <div className="item" id="noti_re_actions" style={{ display: "none" }}>
              <a className="updater_link" id="mark_all_link">
                <i className="pif-check"></i>
                <span>全部標為已讀</span></a>
              <a className="updater_link" id="view_all_plurk">
                <i className="pif-cancel"></i>
                <span>顯示所有訊息</span>
              </a>
            </div>
          </div>
          <div id="noti_pp" className="item" style={{ display: "none" }}>
            <a>
              <i className="pif-message-new"></i>
              <span id="noti_pp_text">查看置頂訊息</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlurkTimelineControl