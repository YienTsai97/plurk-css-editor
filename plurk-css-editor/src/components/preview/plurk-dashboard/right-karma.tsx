const RightKarma = () => {
  return (
    <>
      <style>
        {`
        //Karma
#dash-stats{
  width: 100%;
}
#plurk-dashboard #dash-stats .dash-stats-karma {
    float: left;
    width: 37%;
    min-width: 210px;
    text-align: center;
    margin: 15px 0;
}
.karma_hover {
    margin: 10px 0 10px 10px;
    position: relative;
    font-size: 28px;
    font-family: Georgia, "Times New Roman", Times, serif;
    line-height: 30px;
    white-space: nowrap;
}
.karma_hover .karma_red {
    color: #c60900;
}
.karma_hover #karma_arrow.show {
  display: inline-block;
}
.karma_hover #karma_arrow {
  display: none;
  vertical-align: top;
  font-size: 12px;
  margin-top: -8px;
}
.karma_hover .pif-arrow-down {
  color: #f0572c;
}
.pif-arrow-down::before {
  content: "";
          display: inline-block;
          width: 12px;
          height: 12px;
          background: url('data:image/svg+xml;utf8,<svg viewBox="0 0 700 649.8" xmlns="http://www.w3.org/2000/svg"><path  fill="%23FF574D" d="M686.1,293.2L522.8,133L394.4,12.3c-25.5-24-67.3-5.9-67.3,29.1v159.8v15.7l-237.7,0.7c-47.5,0.1-85.9,38.7-85.9,86.2v44v16.4c0,47.6,38.6,86.2,86.2,86.2H327v159.8c0,35,41.8,53.1,67.3,29.1l128.4-120.7l163.3-160.2c9.2-9,13.8-20.8,13.8-32.7C699.9,314,695.3,302.2,686.1,293.2z"/></svg>');
          background-size: contain;
          background-repeat: no-repeat;
          transform: rotate(90deg);
          position: absolute;
          margin-left: 5px;
          margin-top: 9px;
}
          #plurk-dashboard #dash-stats table {
    float: none;
    width: auto;
    height: 72px;
    overflow: hidden;
}
table {
    border-collapse: collapse;
    border-spacing: 0;
}
tbody {
    display: table-row-group;
    vertical-align: middle;
    unicode-bidi: isolate;
    border-color: inherit;
}
#plurk-dashboard #dash-stats table th {
    vertical-align: bottom;
    font-weight: normal;
    text-align: center;
    padding: 8px 3px 0 0;
    font-size: 12px;
    opacity: 0.7;
}
#plurk-dashboard #dash-stats table th {
    vertical-align: bottom;
    font-weight: normal;
    text-align: center;
    padding: 8px 3px 0 0;
    font-size: 12px;
    opacity: 0.7;
}
#plurk-dashboard #dash-stats table td {
    vertical-align: bottom;
    padding: 8px 5px 0 0;
    color: #333;
    font-size: 15px;
    width: 26%;
    white-space: nowrap;
}

        `}
      </style>
      <div className="dash-segment dash-segment-stats">
        <div className="segment-content">
          <div id="dash-stats">
            {" "}
            <h2>統計</h2>
            <div className="dash-stats-karma">
              <div className="karma_hover">
                {" "}
                Karma:&nbsp;
                <span id="karma_holder">
                  <span id="karma_div">
                    <span id="karma" className="karma_red">
                      0.00
                    </span>
                  </span>
                </span>
                <span
                  id="karma_arrow"
                  className="show pif-arrow-down"
                ></span>
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
                  <td id="join_date" title="">
                    2025-5-14
                  </td>
                  <th>上次登入</th>
                  <td id="last_visit">2025-6-5</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}

export default RightKarma