export const PlurkFooter = () => (
  <>
    <style>
      {`
#footer {
    color: #999;
    font-size: 12px;
    padding: 90px 8% 40px;
    position: relative;
    display: inline-block;
    width: 100%;
    height: 100%;
}
        #footer .copyright {
    display: block;
    margin-bottom: 4px;
}
#footer ul {
    text-align: center;
    margin: 0 auto;
}
#footer ul li {
    display: inline;
    white-space: nowrap;
}
        #footer a {
    margin-left: 5px;
    padding: 0px 3px;
    color: #999;
    text-decoration: none;
}
    @media screen and (max-width: 1024px) {
    #footer {
        text-align: center;
    }
@media screen and (max-width: 1024px) {
    #footer ul {
        float: none;
        margin: 0 auto;
    }
}

    `}
    </style>
    <footer className="clearfix">
      <div id="footer">
        <ul>
          <li className="copyright clearfix">
            ©<span>&nbsp;</span>
            <span id="footer-year">
              {new Date().getFullYear()}
              <span> Plurk CSS Generator</span>
            </span>
          </li>
          <li>
            <a href="/aboutUs">--- Footer Demo ---</a>
          </li>
          {/* <li>
            <a href="/aboutUs">關於噗浪</a>
          </li>
          <li>
            <a href="/brandInfo">品牌資產</a>
          </li>
          <li>
            <a href="/advertising">廣告合作</a>
          </li>
          <li>
            <a href="https://plurk.waca.ec/" target="_blank">
              噗浪商店
            </a>
          </li>
          <li>
            <a href="/Verified/" target="_blank">
              官方認證名單
            </a>
          </li>
          <li>
            <a href="/terms">服務條款</a>
          </li>
          <li>
            <a href="/privacy">隱私權政策</a>
          </li>
          <li>
            <a href="/content-policy">內容守則</a>
          </li>
          <li>
            <a href="/help">常見問答</a>
          </li>
          <li>
            <a href="/contact">聯絡噗浪</a>
          </li> */}
        </ul>
      </div>
    </footer>
  </>
);
