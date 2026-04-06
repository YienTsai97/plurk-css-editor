import BorderEditor from "@/components/controllers/border-editor";
import ColorPicker from "@/components/controllers/color-picker";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger
} from "@/components/ui/context-menu";
import { useStyleManager, useStyleProp } from "@/store/styleManager/styleManager";
import Image from "next/image";
import { useEffect } from "react";
import {
  PlurkPostStyles
} from "./plurk-post.styles";

const PlurkPost = () => {
  const setInitialBatch = useStyleManager(s => s.setInitialBatch);

  useEffect(() => {
    setInitialBatch(".plurk_cnt", {
      backgroundColor: "rgba(255, 255, 255, 1)",
      backgroundImage: "none",
      border: "none",
    });
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

  // 檢查是否有任何手動調整
  const hasManualChanges = bgColorChanged || bgImageChanged || borderChanged || nameColorChanged;

  return (
    <>
      {/* 樣式邏輯 - 完全分離，傳遞詳細的變化狀態 */}
      <PlurkPostStyles
        bgColor={bgColor.value as string}
        bgImage={bgImage.value as string}
        border={border.value as string}
        nameColor={nameColor.value as string}
        hasManualChanges={hasManualChanges}
        bgColorChanged={bgColorChanged}
        bgImageChanged={bgImageChanged}
        borderChanged={borderChanged}
        nameColorChanged={nameColorChanged}
      />

      {/* 純 JSX 邏輯 */}
      <ContextMenu>
        <ContextMenuTrigger>
          <table>
            <tbody>
              <tr>
                <td className="td_img">
                  <div className="p_img">
                    <a target="_blank" href="/ptestcss" rel="noopener noreferrer">
                      <Image
                        src="https://s.plurk.com/c8980959827c3c923bdd.jpg"
                        alt="ptestcss avatar"
                        width={20}
                        height={20}
                      />
                    </a>
                  </div>
                </td>

                <td>
                  <div
                    id="plurk_cnt_354208900685065"
                    className="plurk_cnt"
                  >
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
        </ContextMenuTrigger>

        <ContextMenuContent style={{ zIndex: 1300 }}>
          <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <ColorPicker
              value={bgColor.value as string}
              onChange={(v) => bgColor.set(v)}
              defaultValue={(bgColor.initial as string) || "rgba(255, 255, 255, 1)"}
              showReset
            />
            <BorderEditor borderValue={border.value} setChange={border.set} />
          </div>
        </ContextMenuContent>
      </ContextMenu>
    </>
  );
};

export default PlurkPost;