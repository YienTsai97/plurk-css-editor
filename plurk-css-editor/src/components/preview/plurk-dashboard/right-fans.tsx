import Image from "next/image"

const RightFans = () => {
  return (
    <>
      <style>
        {`
        //Fans
.friend_man:before {
    font-size: 14px;
    margin-right: 5px;
    margin-left: -1px;
    width: 16px;
    text-align: center;
    vertical-align: top;
    line-height: 14px;
}
.friend_man.unfollow, .friend_man.add_follow, .friend_man.add-as-fan {
    background-color: #207298;
}
#plurk-dashboard #dash-friends-pics, #plurk-dashboard #dash-fans-pics {
    margin: 10px 0 0 0;
}
.dash-segment.friendsList.dash-segment-fans{
    width: 49.3%;
}
#plurk-dashboard .dash-segment-fans #dash-fans #fan_managment {
  margin-top: 5px;
      display: flex;
      justify-content: center;
}
        `}
      </style>
      <div className="dash-segment friendsList dash-segment-fans">
        <div className="segment-content">
          <div id="dash-fans">
            <h2 id="h2_fans">粉絲</h2>
            <div id="fan_managment">
              <span id="render_follow">
                <a className="friend_man follow-editor pif-follow_add add_follow">
                  <Image
                    src={"/add_eye_icon.png"}
                    width={15}
                    height={15}
                    alt="look"
                  />
                  <span>關注</span>
                </a>
              </span>
              <a
                className="friend_man pif-fans is_fan"
                style={{ display: "none" }}
              ></a>
            </div>
            <div id="dash-fans-pics">
              <div className="show_all_friends">
                <a>
                  所有粉絲 (<span id="num_of_fans">0</span>)
                </a>
              </div>
              <div id="fan_holder" className="friend_holder">
                <span>目前沒有粉絲。</span>
                <p style={{ marginTop: "8px" }}>
                  粉絲是關注你發表的訊息，但不在你的朋友清單中的人。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default RightFans