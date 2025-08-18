import Image from "next/image";

const PlurkPost = () => {
  return (
    <>
      <style>
        {`
        .timeline-cnt .display table {
    width: 100%;
}
    .plurk td {
    vertical-align: top;
    white-space: nowrap !important;
}
.td_img {
    width: 0;
    min-width: 20px;
}
    .p_img, .p_img img {
    width: 20px;
    height: 20px;
}
.plurk_cnt {
    position: relative;
    font-weight: normal;
    color: #111;
    background-color: #fff;
    padding: 2px 0 0;
    line-height: 1.3;
    transition: background-color 5s;
    box-shadow: 1px 1px 3px -3px #000;
}
.td_qual {
    width: auto;
    padding: 2px 0 2px 5px;
    white-space: nowrap;
}
    .name {
    color: #111;
    font-weight: bold;
    text-decoration: none;
}
    .td_cnt {
    width: 100%;
    padding: 2px 5px 5px 0;
}
    .text_holder {
    position: relative;
    background: none;
    min-width: 48px;
    white-space: normal !important;
    word-wrap: anywhere;
    word-break: normal;
    -webkit-hyphens: auto;
    hyphens: auto;
}
    .timeline-cnt .plurk .text_holder {
    width: 180px;
    white-space: normal;
    min-height: 1.3em;
    padding-right: 4px;
    height: auto;
    overflow: hidden !important;
}
.timeline-cnt .display .text_holder {
    width: 100%;
    max-width: 80vw;
    height: auto !important;
    min-height: 2em;
    max-height: none !important;
    white-space: normal;
    min-width: 180px;
}
.timeline-cnt .plurk [data-component="plurk-reactions"], .timeline-cnt .plurk .manager {
    display: none;
}
.link_extend [data-component="plurk-reactions"], .plurk_box [data-component="plurk-reactions"], .link_extend .manager, .plurk_box .manager {
    display: block !important;
}
plurk-reactions {
    display: block;
    margin: 0.5rem 0;
}
plurk-reactions .reactions {
    gap: 4px;
    display: flex;
    flex-flow: row wrap;
}
plurk-reactions .reactions__adder {
    padding-left: 8px;
    padding-right: 8px;
    padding-top: 4px;
    padding-bottom: 4px;
    gap: 4px;
    border-top-left-radius: 100px;
    border-bottom-left-radius: 100px;
    border-top-right-radius: 100px;
    border-bottom-right-radius: 100px;
    display: flex;
    flex-flow: row nowrap;
    height: 22px;
    color: #A1A6B5;
    font-size: 13px;
    background: rgba(175, 184, 204, 0.2);
    cursor: pointer;
}
plurk-reactions .reactions__adder > i {
    line-height: 1;
}
/* Icon styles for reactions and manager buttons */
.pif-add-reaction:before {
    content: '';
    display: inline-block;
    width: 10px;
    height: 10px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23A1A6B5'%3E%3Cpath d='M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z'/%3E%3C/svg%3E");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
}

/* Manager button icon styles */
.manager a {
    position: relative;
    display: inline-block;
    width: 16px;
    height: 16px;
    margin-left: 12px;
    color: #AFB8CC;
    border-radius: 3px;
    padding: 2px 5px 3px;
    text-decoration: none !important;
    cursor: pointer;
}

.manager a:before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 13px;
    height: 13px;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
}

/* Individual icon styles */
.pif-edit:before {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23AFB8CC'%3E%3Cpath d='M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z'/%3E%3C/svg%3E");
}

.pif-volume:before {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23AFB8CC'%3E%3Cpath d='M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z'/%3E%3C/svg%3E");
}

.pif-like:before {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23AFB8CC'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/%3E%3C/svg%3E");
}

.pif-bone:before {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23AFB8CC'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'/%3E%3C/svg%3E");
}

.pif-option:before {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23AFB8CC'%3E%3Cpath d='M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z'/%3E%3C/svg%3E");
}
.manager {
    float: right;
    color: #AFB8CC;
    padding: 3px 4px 0;
    margin-top: 4px;
}
    .manager > a {
    display: inline-block;
    margin-left: 12px;
    color: #AFB8CC;
    border-radius: 3px;
    padding: 2px 5px 3px;
    text-decoration: none !important;
    cursor: pointer;
}
.manager:after {
    content: '';
    clear: both;
    height: 0;
    display: block;
}
    .timeline-cnt .plurk.plurk_box .time, .timeline-cnt .plurk.plurk_box .empty-manager {
    display: block;
}
    .timeline-cnt .plurk .time {
    position: absolute;
    bottom: 7px;
    left: 9px;
    font-size: 12px;
    transform: scale(0.95);
    transform-origin: left;
    display: none;
}
    .timeline-cnt .plurk .time a {
    color: #AFB8CC;
}
.td_response_count {
    width: 0;
    min-width: 15px;
    height: 30px !important;
}
.response_count {
    font-weight: bold;
    color: #fff;
    background-color: rgba(0, 0, 0, 0.1);
    padding: 1px 4px;
}
        `}
      </style>
      <table>
        <tbody>
          <tr>
            <td className="td_img">
              <div className="p_img">
                <a target="_blank" href="/ptestcss" rel="noopener noreferrer">
                  <Image src="https://s.plurk.com/c8980959827c3c923bdd.jpg" alt="ptestcss avatar" width={20} height={20} />
                </a>
              </div>
            </td>
            <td>
              <div id="plurk_cnt_354208900685065" className="plurk_cnt">
                <table>
                  <tbody>
                    <tr className="tr_cnt">
                      <td className="td_qual">
                        <span>
                          <a
                            href="/ptestcss"
                            data-uid="17746193"
                            className="name"
                          >
                            ptestcss
                          </a>
                          <span>&nbsp;</span>
                        </span>
                      </td>
                      <td className="td_cnt">
                        <div className="text_holder">test PostB</div>
                        <div
                          data-component="plurk-reactions"
                          data-pid="354208900685065"
                        >
                          <div className="reactions">
                            <div className="reactions__adder">
                              <i className="pif-add-reaction"></i>
                            </div>
                          </div>
                        </div>
                        <div className="manager">
                          <a href="#" className="pif-edit edit" tabIndex={-1} aria-label="Edit"></a>
                          <a href="#" className="mute pif-volume mute-off" tabIndex={-1} aria-label="Mute"></a>
                          <a href="#" className="pif-like like like-off" tabIndex={-1} aria-label="Like"></a>
                          <a href="#" className="pif-bone gift gift-receive" tabIndex={-1} aria-label="Gift"></a>
                          <a href="#" className="pif-option option" tabIndex={-1} aria-label="Options"></a>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="time">
                  <a href="/p/3hk1bm2ccp" target="_blank" rel="noopener noreferrer">
                    <span
                      className="posted"
                      data-posted="2025-08-02T16:43:01.000Z"
                    >
                      <time dateTime="2025-08-02T16:43:01.000Z" className="timeago">
                        13 小時前
                      </time>
                    </span>
                  </a>
                </div>
              </div>
            </td>
            <td className="td_response_count">
              <a href="/p/3hk1bm2ccp" target="_blank" rel="noopener noreferrer">
                <span className="response_count" style={{ display: "none" }}>
                  0
                </span>
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  )
}

export default PlurkPost