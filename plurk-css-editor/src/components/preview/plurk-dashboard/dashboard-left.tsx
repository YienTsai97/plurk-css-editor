import Image from "next/image";

const DashboardLeft = () => {
  return (
    <>
      <style>
        {`
        // Left
.dash-segment-profile {
    width: 100%;
}
#plurk-dashboard .dash-segment-profile #dash-profile {
    position: relative;
    text-align: left;
}
#plurk-dashboard .dash-segment.dash-segment-profile {
    width: 100%;
}
// #plurk-dashboard .dash-segment-profile {
//     width: 50;
// } above is to replace this part

//Name
#plurk-dashboard .dash-segment-profile #dash-profile a {
width: 86px;
}
#plurk-dashboard .dash-segment-profile #dash-profile img, video {
    max-width: 100%;
    height: auto;
    border-radius: 10%;
}
#plurk-dashboard .dash-segment-profile #dash-profile #full_name {
    position: absolute;
    top: 1px;
    margin-left: 92px;
    font-size: 17px;
}
#plurk-dashboard .dash-segment-profile #dash-profile #full_name .display_name {
    display: block;
    margin-bottom: 1px;
    line-height: 1.1em;
}
#plurk-dashboard .dash-segment-profile #dash-profile #full_name .nick_name {
    display: block;
}
.nick_name {
    font-size: 12px;
    opacity: 0.85;
}
#plurk-dashboard .dash-segment-profile #dash-profile .profile-info {
    position: absolute;
    margin-left: 92px;
    bottom: 0;
    opacity: 0.85;
}
#plurk-dashboard .dash-segment-profile #dash-profile .profile-icons {
    position: absolute;
    bottom: 0;
    right: 2px;
    white-space: nowrap;
    font-size: 0;
    height: 20px;
}

//Location
#plurk-dashboard .dash-segment-profile #dash-additional-info #private_plurk {
    margin-bottom: 10px;
}
.friend_man.private_plurk {
    background-color: #207298;
}
.friend_man.send_gift {
    background-color: #E8AD40;
    display: flex;
    align-items: center;
    gap: 4px;
    width:fit-content;
}
#private_plurk{
display:flex;
}
#plurk-dashboard p {
    margin: 0;
}
.friend_man {
    padding: 6px 10px;
    margin: 0 2px;
    color: white !important;
    font-size: 12px;
    text-decoration: none !important;
    line-height: 15px;
    border-radius: 5px;
    cursor: pointer !important;
    overflow: hidden;
    white-space: nowrap;
    display: inline-block;
    transition: background-color 300ms;
}
#plurk-dashboard .dash-segment-profile #dash-additional-info {
  padding: 5px;
}
        `}
      </style>
      <div className="dash-group-left">
        <div className="dash-segment dash-segment-profile">
          <div className="segment-content">
            <div id="dash-profile">
              <a href="/settings/avatar">
                <Image
                  src="https://s.plurk.com/52de7e8ca7c3179df400.jpg"
                  className="profile-pic"
                  id="profile_pic"
                  width={86}
                  height={86}
                  alt="profile"
                />{" "}
              </a>{" "}
              <div id="full_name">
                <span className="display_name">ptestcss </span>
                <span className="nick_name">@ptestcss</span>
              </div>
              <div className="profile-info">
                <span id="span_years"></span>
                <span id="m_or_f">不透露/其他</span>
              </div>
              <div className="profile-icons"></div>
            </div>
          </div>
          <div className="segment-content">
            <div id="dash-additional-info">
              <div id="private_plurk">
                <span id="render_private_plurk">
                  <a className="friend_man private_plurk hideBlock">
                    傳送私人訊息
                  </a>
                </span>
                <span id="render_send_gift">
                  <a className="friend_man send_gift hideBlock">
                    <i className="pif-bone">
                      <svg
                        version="1.1"
                        width="15"
                        height="15"
                        x="0px"
                        y="0px"
                        viewBox="0 0 60.9 60.9"
                        xmlSpace="preserve"
                        fill="#FFFFFF"
                      >
                        <g>
                          <path className="st0" d="M30.5,3c15.2,0,27.5,12.3,27.5,27.5S45.6,57.9,30.5,57.9S3,45.6,3,30.5S15.3,3,30.5,3 M30.5,0
		C13.7,0,0,13.7,0,30.5s13.7,30.5,30.5,30.5s30.5-13.7,30.5-30.5S47.3,0,30.5,0L30.5,0z"/>
                        </g>
                        <g>
                          <g>
                            <path className="st0" d="M30.5,4.3C16,4.3,4.3,16,4.3,30.5S16,56.7,30.5,56.7s26.2-11.7,26.2-26.2S44.9,4.3,30.5,4.3z M47.4,37.8
			c-0.2,2.2-1.4,3.7-3.3,4.7c-0.5,0.3-0.9,0.6-1.2,1.2c-0.7,1.6-1.9,2.7-3.7,3.1c-0.5,0.1-0.9,0.1-1.2,0.2c-1.8,0-3.3-0.5-4.4-1.8c-0.9-1-1.4-2.1-1.6-3.5c-0.1-1,0.1-1.9,0.4-2.7c0.1-0.2,0-0.4-0.1-0.5C28.9,34.9,25.5,31.5,22,28c-0.2-0.2-0.3-0.2-0.6-0.1c-0.7,0.3-1.5,0.4-2.2,0.4c-1.2,0-2.3-0.3-3.3-1c-1.4-1-2-2.3-2.2-3.9c-0.4-3.2,1.6-5.1,3.6-6c0.3-0.2,0.5-0.4,0.7-0.7
			c0.8-1.8,1.9-3.1,3.9-3.5c2-0.4,3.9,0,5.3,1.5c1.7,1.8,2.2,3.9,1.3,6.3c-0.1,0.2-0.1,0.3,0.1,0.5c3.5,3.5,7,7,10.5,10.5
			c0.2,0.2,0.3,0.2,0.6,0.1C43.5,30.5,47.7,33.6,47.4,37.8z"/>
                          </g>
                        </g>
                      </svg>
                    </i>
                    送禮物
                  </a>
                </span>
              </div>
              <p id="location_container">
                <span id="location">Canada</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default DashboardLeft