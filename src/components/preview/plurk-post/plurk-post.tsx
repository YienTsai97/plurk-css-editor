import type { CSSProperties } from "react";
import { EditorMenuContent } from "@/components/editor/editor-context-menu";
import {
  IconAddReaction,
  IconBookmark,
  IconEdit,
  IconGift,
  IconOptions,
  IconR18Plus,
} from "@/components/preview/common/preview-icons";
import {
  ContextMenu,
  ContextMenuTrigger
} from "@/components/ui/context-menu";
import Image from "next/image";
import { PlurkManagerLikeIcon } from "./manager/like-icon";
import { PlurkManagerMuteIcon } from "./manager/mute-icon";
import PlurkManagerReplurkIcon from "./manager/replurk-icon";
import {
  useManagerIconToggle,
  useManagerIconToggleWithCount,
} from "./manager/use-manager-icon-toggle";
import { PlurkPostAppearanceStyles } from "./plurk-post-appearance/plurk-post-appearance-styles";
import { PlurkPostContextMenuContent } from "./plurk-post-context-menu-content";
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
  const mute = useManagerIconToggle(data.pid, data.muteState)
  const like = useManagerIconToggleWithCount(data.pid, data.likeState, data.likeCount)
  const replurk = useManagerIconToggleWithCount(data.pid, data.replurkState, data.replurkCount)

  return (
    <>
      {!skipStyles && (
        <>
          <PlurkPostStyles />
          <PlurkPostAppearanceStyles />
        </>
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
                                  className={data.nameColor ? "name has-name-color" : "name"}
                                  style={
                                    data.nameColor
                                      ? ({ color: data.nameColor, "--name-color": data.nameColor } as CSSProperties)
                                      : undefined
                                  }
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
                                  <span className="porn-icon pif-porn" aria-label="成人內容">
                                    <IconR18Plus size={21} />
                                  </span>
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
                                  <div className="reactions__adder" aria-label="新增互動">
                                    <IconAddReaction size={18} />
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
                              {data.timePrefix ? `${data.timePrefix} ` : null}
                              <time className="timeago">
                                {data.timeText}
                              </time>
                            </span>
                          </a>
                        </div>
                        <div className="manager">
                          {data.showEdit && (
                            <a className="edit" tabIndex={-1} aria-label="Edit">
                              <IconEdit size={18} />
                            </a>
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
                            <a
                              className={`mark ${data.markState === "on" ? "mark-on" : "mark-off"}`}
                              tabIndex={-1}
                              aria-label="Bookmark"
                            >
                              <IconBookmark size={18} />
                            </a>
                          )}
                          <a className="gift gift-receive" tabIndex={-1} aria-label="Gift">
                            <IconGift size={18} />
                          </a>
                          <a className="option" tabIndex={-1} aria-label="Options">
                            <IconOptions size={18} />
                          </a>
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

          {/* 用途：貼文右鍵選單外殼；內容拆到 PlurkPostContextMenuContent，避免預覽 markup 混入控制器 UI。 */}
          <EditorMenuContent>
            <PlurkPostContextMenuContent />
          </EditorMenuContent>
        </ContextMenu>
      </div>
    </>
  );
};

export default PlurkPost;
