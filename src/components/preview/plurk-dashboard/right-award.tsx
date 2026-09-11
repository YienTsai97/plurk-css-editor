const RightAward = () => {
  return (
    <>
      <style>
        {`
        //award
#plurk-dashboard .dash-segment-award {
    clear: both;
}
#plurk-dashboard .dash-segment-award .segment-content {
    background: none;
}
#plurk-dashboard .dash-segment-award .segment-content .award_bar div {
    float: left;
    font-weight: bold;
    width: 39px;
    height: 39px;
    margin: 0 8px 6px 0;
    text-align: center;
    cursor: default;
}
.cmp_10_days {
    // background: transparent url(https://s.plurk.com/badges_sprite/781a2d28dda58209317a.png) 0 -848px no-repeat;
    background: transparent url(/badge.png);
    width: 39px;
    font-size: 1px;
    height: 39px;
}
#plurk-dashboard .link_arrow {
    margin-left: 10px;
    font-size: 11px;
    display: block;
    margin-top: 10px;
    text-align: left;
}
#plurk-dashboard .link_arrow i {
    margin-right: 5px;
}
#plurk-dashboard .link_arrow {
  display: inline-flex;
  align-items: center;
  gap: 4px; 
}
        `}
      </style>
      <div className="dash-segment dash-segment-award">
        <div className="segment-content">
          <div id="dash-award">
            <div className="award_bar clearfix">
              <div className="cmp_10_days"></div>
              <div className="cmp_10_days"></div>
              <div className="cmp_10_days"></div>
              <div className="cmp_10_days"></div>
            </div>
            <a className="link_arrow" target="_blank">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 22.703 17"
              >
                <path
                  fill="#E88D43"
                  d="M1.056 21.928c0-6.531 5.661-9.034 10.018-9.375V18.1L22.7 9.044 11.073 0v4.836a10.5 10.5 0 0 0-7.344 3.352C-.618 12.946-.008 21 .076 21.928z"
                  transform="rotate(-90 11.3515 9.964)"
                />
              </svg>
              <span>如何獲得徽章？</span>
            </a>
          </div>
        </div>
      </div>
    </>
  )
}

export default RightAward