import {
  IconDropdown,
  IconEmoticon,
  IconMedia,
  IconMessage,
  IconOptions,
  IconVideo,
  IconVisibility,
} from "@/components/preview/common/preview-icons";
import type { PostThread } from "./plurk-post";

export type PlurkResponseBoxProps = {
  thread: PostThread;
};

const PlurkResponseBox = ({ thread }: PlurkResponseBoxProps) => {
  return (
    <div id="form_holder" onClick={(e) => e.stopPropagation()}>
      <div className="response_box">
        <div className="response_info clearfix">
          {thread.favoriteCount ? (
            <div className="favorite_count button small-button">{thread.favoriteCount} 喜歡</div>
          ) : null}
          <div className="reaction_count">
            <div className="button small-button">{thread.reactionCount} 互動</div>
          </div>
          <div className="response-status">
            <span className="response-count">
              <IconMessage size={14} />
              {thread.responseLabel}
            </span>
            <div className="response-display-options">
              <span className="response-display-options__prefix">
                <IconVisibility size={12} />
              </span>
              <span className="response-display-options__label">回應顯示方式</span>
              <span className="response-display-options__suffix">
                <IconOptions size={10} />
              </span>
            </div>
          </div>
        </div>

        <div className="list-container">
          <div className="list">
            {thread.responses.map((response) => (
              <div
                key={response.id}
                className={`plurk cboxAnchor response${response.isOwner ? " highlight_owner" : ""}`}
              >
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <div className="plurk_cnt">
                          <table>
                            <tbody>
                              <tr className="tr_cnt">
                                <td className="td_qual">
                                  <span>
                                    <a
                                      className="name"
                                      style={response.nameColor ? { color: response.nameColor } : undefined}
                                    >
                                      {response.displayName}
                                    </a>
                                    <span>&nbsp;</span>
                                  </span>
                                </td>
                                <td className="td_cnt">
                                  <div className="text_holder">{response.content}</div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ))}
          </div>
          <div className="list-container__bottom-indicator"></div>
        </div>
      </div>

      <div className="poster_holder">
        <div className="mini_form">
          <div className="plurkForm mini-mode response-theme">
            <div className="submit_img submit_img_color">
              <span className="submit_img__text">Plurk</span>
            </div>
            <div className="input_holder">
              <div className="qual_holder">
                <div className="dd_img m_qualifier q_freestyle" data-qual="freestyle">
                  <span style={{ display: "none" }}></span>
                  <IconDropdown size={12} />
                </div>
              </div>
              <div className="textarea_holder">
                <textarea className="content" id="input_small" placeholder=""></textarea>
              </div>
            </div>
            <ul className="icons_holder">
              <li className="cmp_emoticon_mini_off" aria-label="表情">
                <IconEmoticon size={18} />
              </li>
              <li className="cmp_media_mini_off" aria-label="圖片">
                <IconMedia size={18} />
              </li>
              <li className="cmp_video_mini_off" aria-label="影片">
                <IconVideo size={18} />
              </li>
            </ul>
            <div className="char_updater">
              <div className="status-bar status-bar--post">
                <div className="press-enter">
                  <span>按 Enter 送出</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlurkResponseBox;
