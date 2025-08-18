import Image from "next/image";

export const PlurkTopBar = () => {
  return (
    <>
      <style>
        {`
        #top_bar * {
    vertical-align: middle;
    text-align: center;
    color: #FFF;
}
          #top_bar {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            padding: 0 12px
            }
          .bar-color {
            background: #FF574D;
            opacity: 0.9 !important;
          }
          #top_bar, .bar-color {
            z-index: -1;
            position: absolute;
            width: 100%;
            height: 42px;
            top: 0;
            left: 0;
          }
          #top-bar-main,#top-bar-title,#top-bar-user{
            height: 42px;
            margin-y: auto;
            display: flex;
            align-items: center;
          }
          .item-container, #navbar-account #nav-account{
            display: flex;
            align-items: center;
            gap:9px;

            img {
            width:20px
          }
        `}
      </style>
      <div id="top_bar" className="">
        <div className="bar-color"></div>
        <div id="top-bar-main">
          <ul className="item-container">
            <li id="navbar-timeline" className="item tab portal current">
              <a href="/">
                <Image src={"/testicon/star.svg"} alt="star" width={24} height={24} />
              </a>
            </li>
            <li id="navbar-portal" className="item tab portal">
              <div id="bar-portal">
                <i className="bar-icon pif-topplurk">
                  <Image src={"/testicon/star.svg"} alt="star" width={24} height={24} />
                </i>
              </div>
            </li>
            <li id="navbar-shortcut" className="item tab portal">
              <div id="bar-shortcut">
                <i className="bar-icon pif-pin">
                  <Image src={"/testicon/star.svg"} alt="star" width={24} height={24} />
                </i>
              </div>
            </li>
            <li id="navbar-search" className="item hideMobile portal nohover">
              <div>
                <i className="bar-icon pif-search">
                  <Image src={"/testicon/star.svg"} alt="star" width={24} height={24} />
                </i>
              </div>
            </li>
          </ul>
        </div>
        <div id="top-bar-title">
          <div id="plurk_logo" className="nohover">
            <a href="/" className="pif-plurklogo">
              <Image src={"/plurk-icon.svg"} alt="plurklogo" width={28.55} height={24} />
            </a>
          </div>
        </div>
        <div id="top-bar-user">
          <ul className="item-container">
            <li id="navbar-premium" className="item hideMobile">
              <a href="#" id="bar-premium">
                <i className="bar-icon pif-bone"></i>
              </a>
            </li>
            <li id="navbar-notify" className="item hideMobile">
              <a href="#" id="bar-notify">
                <i className="bar-icon pif-notify"></i>
              </a>
            </li>
            <li id="navbar-account" className="item">
              <div id="nav-account">
                <Image
                  src="https://s.plurk.com/ff97ec67bb96f4d8642a.jpg"
                  style={{}}
                  alt="user avatar"
                  width={20}
                  height={20}
                />
                <span>ptestcss</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};
