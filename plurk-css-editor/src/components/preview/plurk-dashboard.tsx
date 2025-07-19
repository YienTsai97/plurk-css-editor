"use client";

export const PlurkDashboard = () => {
  return (
    <div id="dashboard_holder"> <div id="plurk-dashboard" className="own">
      <div className="dash-group-form">
        <div className="dash-segment dash-segment-post">
          {/* <div className="segment-content">
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
          </div> */}
        </div>
      </div>
      <div className="dash-group-left">
        <div className="dash-segment dash-segment-profile">
          <div className="segment-content">
            <div id="dash-profile">
              <a href="/settings/avatar">
                <img src="https://s.plurk.com/52de7e8ca7c3179df400.jpg" className="profile-pic" id="profile_pic" /> </a> <div id="full_name">
                <span className="display_name">ptestcss </span>
                <span className="nick_name">@ptestcss</span>
              </div>
              <div className="profile-info">
                <span id="span_years"></span>
                <span id="m_or_f">不透露/其他</span>
              </div>
              <div className="profile-icons">
              </div>
            </div>
          </div>
          <div className="segment-content">
            <div id="dash-additional-info">
              <p id="location_container"> <span id="location">Canada</span> </p>
            </div>
          </div>
        </div>
      </div>
      <div className="dash-group-right">
        <div className="dash-segment dash-segment-stats">
          <div className="segment-content">
            <div id="dash-stats"> <h2>統計</h2>
              <div className="dash-stats-karma">
                <div className="karma_hover"> Karma:
                  <span id="karma_holder">
                    <span id="karma_div">
                      <span id="karma" className="karma_red">0.00</span>
                    </span> </span> <span id="karma_arrow">
                  </span>
                </div>
              </div>
              <table id="dash-stats-table">
                <tbody>
                  <tr>
                    <th>人氣指數</th>
                    <td id="profile_views">1</td>
                    <th>成功募集人數</th>
                    <td>0</td>
                  </tr>
                  <tr>
                    <th>Plurks</th>
                    <td id="plurks_count">0</td>
                    <th>回應數</th>
                    <td id="response_count">0</td>
                  </tr>
                  <tr>
                    <th>註冊日期:</th>
                    <td id="join_date" title="">2025-5-14</td>
                    <th>上次登入</th>
                    <td id="last_visit">2025-6-5</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="dash-segment dash-segment-friends">
          <div className="segment-content">
            <div id="dash-friends">
              <h2>朋友</h2>
              <div id="dash-friends-pics">
                <div className="show_all_friends">
                  <a href="/Friends">所有朋友 (<span id="num_of_friends">0</span>)</a>
                </div>
                <div className="show_mutual_friends"> </div>
                <div id="friend_holder" className="friend_holder">
                  <span>目前沒有朋友。</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="dash-segment friendsList dash-segment-fans">
          <div className="segment-content">
            <div id="dash-fans">
              <h2 id="h2_fans">粉絲</h2>
              <div id="dash-fans-pics">
                <div className="show_all_friends">
                  <a href="/Friends/?page=fans">所有粉絲 (<span id="num_of_fans">0</span>)</a>
                </div>
                <div id="fan_holder" className="friend_holder">
                  <span>目前沒有粉絲。</span>
                  <p style={{ marginTop: "8px" }}>粉絲是關注你發表的訊息，但不在你的朋友清單中的人。</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="dash-segment dash-segment-award">
          <div className="segment-content">
            <div id="dash-award">
              <div className="award_bar clearfix">
                <div className="cmp_10_days">
                </div>
              </div>
              <a href="/help/plurk#what-is-badges" className="link_arrow" target="_blank">
                <i className="pif-arrow-points"></i>如何獲得徽章？
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
};