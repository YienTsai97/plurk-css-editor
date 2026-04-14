import BorderEditor from "@/components/controllers/border-editor";
import ColorPicker from "@/components/controllers/color-picker";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger
} from "@/components/ui/context-menu";
import { PLURK_POST_STYLE_DEFAULTS } from "@/store/styleManager/defaults";
import { useStyleManager, useStyleProp } from "@/store/styleManager/styleManager";
import { cssValueToString } from "@/store/styleManager/utils/cssValue";
import Image from "next/image";
import { useEffect } from "react";
import { PlurkManagerLikeIcon } from "./manager/like-icon";
import { PlurkManagerMuteIcon } from "./manager/mute-icon";
import PlurkManagerReplurkIcon from "./manager/replurk-icon";
import {
  useManagerIconToggle,
  useManagerIconToggleWithCount,
} from "./manager/use-manager-icon-toggle";
import { PlurkPostStyles } from "./plurk-post.styles";
import type { PlurkPostProps } from "./plurk-post.types";

export type { ManagerIconState } from "./manager/icon-state.type";
export type {
  PlurkPostPreviewStyleProps,
  PlurkPostProps, PostData,
  PostQualifier,
  PostReaction,
  PostResponse,
  PostThread
} from "./plurk-post.types";

const PlurkPost = ({ data, skipStyles = false }: PlurkPostProps) => {
  const setInitialBatch = useStyleManager(s => s.setInitialBatch);

  useEffect(() => {
    setInitialBatch(".plurk_cnt", PLURK_POST_STYLE_DEFAULTS);
  }, [setInitialBatch]);

  const bgColor = useStyleProp(".plurk_cnt", "backgroundColor");
  const bgImage = useStyleProp(".plurk_cnt", "backgroundImage");
  const border = useStyleProp(".plurk_cnt", "border");
  const nameColor = useStyleProp(".name", "color");

  // 檢查每個屬性的變化狀態
  const bgColorChanged = bgColor.value !== bgColor.initial;
  const bgImageChanged = bgImage.value !== bgImage.initial;
  const borderChanged = border.value !== border.initial;
  const nameColorChanged = nameColor.value !== nameColor.initial;
  const bgColorValue = cssValueToString(bgColor.value) || PLURK_POST_STYLE_DEFAULTS.backgroundColor;
  const bgColorDefaultValue =
    cssValueToString(bgColor.initial) || PLURK_POST_STYLE_DEFAULTS.backgroundColor;

  const hasManualChanges = bgColorChanged || bgImageChanged || borderChanged || nameColorChanged;

  const mute = useManagerIconToggle(data.pid, data.muteState)
  const like = useManagerIconToggleWithCount(data.pid, data.likeState, data.likeCount)
  const replurk = useManagerIconToggleWithCount(data.pid, data.replurkState, data.replurkCount)

  return (
    <>
      {!skipStyles && (
        <PlurkPostStyles
          backgroundColor={bgColor.value as string}
          backgroundImage={bgImage.value as string}
          border={border.value as string}
          color={nameColor.value as string}
          hasManualChanges={hasManualChanges}
          backgroundColorChanged={bgColorChanged}
          backgroundImageChanged={bgImageChanged}
          borderChanged={borderChanged}
          colorChanged={nameColorChanged}
        />
      )}

      <div className={mute.isOn ? "muted" : undefined}>
        <ContextMenu>
          <ContextMenuTrigger>
            <table>
              <tbody>
                <tr>
                  <td className="td_img">
                    <div className="p_img">
                      <a>
                        <Image
                          src={data.avatarUrl}
                          alt={`${data.displayName} avatar`}
                          width={20}
                          height={20}
                          unoptimized
                        />
                      </a>
                    </div>
                  </td>

                  <td>
                    <div id={`plurk_cnt_${data.pid}`} className="plurk_cnt">
                      <table>
                        <tbody>
                          <tr className="tr_cnt">
                            <td className="td_qual">
                              <span>
                                <a
                                  className="name"
                                  style={data.nameColor ? { color: data.nameColor } : undefined}
                                >
                                  {data.displayName}
                                </a>
                                {data.qualifier ? (
                                  <span className={`qualifier ${data.qualifier.className}`}>
                                    {data.qualifier.text}
                                  </span>
                                ) : (
                                  <span>&nbsp;</span>
                                )}
                                {data.showPornIcon && (
                                  <span className="porn-icon pif-porn"></span>
                                )}
                              </span>
                            </td>

                            <td className="td_cnt">
                              <div className="text_holder">{data.content}</div>
                              <div data-component="plurk-reactions">
                                <div className="reactions">
                                  {data.reactions?.map((reaction, index) => (
                                    <div key={index} className="reaction reaction--clicked">
                                      {/* eslint-disable-next-line @next/next/no-img-element */}
                                      <img className="reaction__emoticon" src={reaction.src} alt="" />
                                      <span className="reaction__count">{reaction.count}</span>
                                    </div>
                                  ))}
                                  <div className="reactions__adder">
                                    <i className="pif-add-reaction"></i>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <div className="plurk_actions">
                        <div className="time">
                          <a>
                            <span className="posted">
                              <time className="timeago">
                                {data.timeText}
                              </time>
                            </span>
                          </a>
                        </div>
                        <div className="manager">
                          {data.showEdit && (
                            <a className="pif-edit edit" tabIndex={-1} aria-label="Edit"></a>
                          )}
                          <PlurkManagerMuteIcon state={mute.state} onToggle={mute.toggle} />
                          {data.showReplurk && (
                            <PlurkManagerReplurkIcon
                              state={replurk.state}
                              onToggle={replurk.handleToggle}
                              displayCount={replurk.count}
                            />
                          )}
                          <PlurkManagerLikeIcon
                            state={like.state}
                            onToggle={like.handleToggle}
                            displayCount={like.count}
                          />
                          {data.showMark && (
                            <a className="pif-bookmark mark mark-off" tabIndex={-1} aria-label="Bookmark"></a>
                          )}
                          <a className="pif-bone gift" tabIndex={-1} aria-label="Gift"></a>
                          <a className="pif-option option" tabIndex={-1} aria-label="Options"></a>
                        </div>
                      </div>

                    </div>
                  </td>

                  <td className="td_response_count">
                    <a>
                      <span
                        className="response_count"
                        style={{ display: data.showResponseCount ? "block" : "none" }}
                      >
                        {data.responseCount}
                      </span>
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </ContextMenuTrigger>

          <ContextMenuContent style={{ zIndex: 1300 }}>
            <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <ColorPicker
                value={bgColorValue}
                onChange={(v) => bgColor.set(v)}
                defaultValue={bgColorDefaultValue}
                showReset
              />
              <BorderEditor borderValue={border.value} setChange={border.set} />
            </div>
          </ContextMenuContent>
        </ContextMenu>
      </div>
    </>
  );
};

export default PlurkPost;
