import type { PostThread } from "./plurk-post"

export type PlurkResponseBoxProps = {
  thread: PostThread
}

const PlurkResponseBox = ({ thread }: PlurkResponseBoxProps) => {
  return (
    <div id="form_holder" onClick={(e) => e.stopPropagation()}>
      <div className="response_box">
        <div className="response_info clearfix">
          <div className="reaction_count">
            <div className="button small-button">{thread.reactionCount} 互動</div>
          </div>
          <div className="response-status">
            <span className="response-count pif-message">{thread.responseLabel}</span>
            <div className="response-display-options">
              <span className="pif-visibility response-display-options__prefix"></span>
              <span className="response-display-options__label">回應顯示方式</span>
              <span className="pif-option response-display-options__suffix"></span>
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
              <div className="textarea_holder">
                <textarea className="content" id="input_small" placeholder=""></textarea>
              </div>
            </div>
            <ul className="icons_holder">
              <li className="cmp_emoticon_mini_off pif-emoticon"></li>
              <li className="cmp_media_mini_off pif-media"></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlurkResponseBox
