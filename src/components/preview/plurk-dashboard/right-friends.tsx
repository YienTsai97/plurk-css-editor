const RightFriends = () => {
  return (
    <>
      <style>
        {`
        // Friends
#plurk-dashboard #dash-friends-pics, #plurk-dashboard #dash-fans-pics {
    margin: 10px 0 0 0;
}
.show_all_friends, .show_mutual_friends {
    float: left;
    margin: 0 15px 5px 0;
}
.show_all_friends, .show_mutual_friends {
    float: left;
    margin: 0 15px 5px 0;
}
.friend_holder {
    clear: both;
}
.friend_holder img
Specificity: (0,1,1)
 {
    width: 35px;
    height: 35px;
    border: 0;
}
#plurk-dashboard .dash-segment-friends #dash-friends #friend_managment {
    margin-top: 5px;
    text-align: center;
    display: flex;
    justify-content: center;
}
.friend_man.add_friend, .friend_man.accpet {
    background-color: #7aa716;
}
    #plurk-dashboard .dash-segment-friends {
width: 49.3%;
margin-right: 1.4%;
}
a.friend_man.friend-editor.pif-user-add.add_friend{
display: flex;
width: fit-content;
gap: 4px;
}
        `}
      </style>
      <div className="dash-segment dash-segment-friends">
        <div className="segment-content">
          <div id="dash-friends">
            <h2>朋友</h2>
            <div id="friend_managment">
              <span id="render_friend">
                <a className="friend_man friend-editor pif-user-add add_friend">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 422.8 573.2"
                  >
                    <g>
                      <path
                        fill="#FFFFFF"
                        d="M401.8,445.7c-6.5-13.2-14.4-25.7-23.5-37.2c-40.1-51-93.8-83.9-165.4-84c-0.5,0-1,0-1.5,0c-0.5,0-1,0-1.5,0
                            c-71.7,0-125.3,33-165.4,84c-9.1,11.5-17,24-23.5,37.2C7.5,473,0,503.6,0,535.9v37.4h113.2h45.3h95.7h45.3h123.2v-37.4
                            C422.8,503.6,415.3,473,401.8,445.7z"
                      />
                      <path
                        fill="#FFFFFF"
                        d="M209.8,0C120.2,0,47.6,72.6,47.6,162.2s72.6,162.2,162.2,162.2s162.2-72.6,162.2-162.2S299.5,0,209.8,0z
                            M312.5,186.1c-25.6,0-77.3,0-77.3,0s0,60,0,83h-47.7c0-23,0-83,0-83s-51.7,0-77.3,0v-47.7c25.6-0.1,77.3-0.1,77.3-0.1
                            s0-60.1,0-83h47.7c-0.1,22.9,0,83,0,83s51.7,0,77.3,0V186.1z"
                      />
                    </g>
                  </svg>
                  加為朋友
                </a>
              </span>
            </div>
            <div id="dash-friends-pics">
              {" "}
              <div className="show_all_friends">
                <a>
                  所有朋友 (<span id="num_of_friends">0</span>)
                </a>
              </div>
              <div className="show_mutual_friends">
                <a>
                  共同好友 (<span id="num_of_mutual_friends">0</span>)
                </a>
              </div>
              <div id="friend_holder" className="friend_holder">
                <span>目前沒有朋友。</span>
              </div>{" "}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default RightFriends