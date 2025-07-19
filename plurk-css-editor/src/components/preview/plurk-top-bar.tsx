export const PlurkTopBar = () => {
  return (
    <div id="top_bar" className="clearfix">
      <div className="bar-color"></div>
      <div id="top-bar-main">
        <ul className="item-container">
          <li id="navbar-timeline" className="item tab portal current">
            <a href="/">
              <i className="bar-icon pif-home"></i>
            </a>
          </li>
          <li id="navbar-portal" className="item tab portal">
            <div id="bar-portal">
              <i className="bar-icon pif-topplurk"></i>
            </div>
          </li>
          <li id="navbar-shortcut" className="item tab portal">
            <div id="bar-shortcut">
              <i className="bar-icon pif-pin"></i>
            </div>
          </li>
          <li id="navbar-search" className="item hideMobile portal nohover">
            <div>
              <input type="text" placeholder="要找什麼嗎？" />
              <i className="bar-icon pif-search"></i>
            </div>
          </li>
        </ul>
      </div>
      <div id="top-bar-title">
        <div id="plurk_logo" className="nohover">
          <a href="/" className="pif-plurklogo"></a>
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
              <img src="https://s.plurk.com/ff97ec67bb96f4d8642a.jpg" style={{}} />
              <span>ptestcss</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};