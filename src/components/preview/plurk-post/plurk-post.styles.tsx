import { PLURK_POST_STYLE_DEFAULTS } from "@/store/styleManager/defaults";

/** 預覽貼文主體的基礎版面與 Plurk 時間軸結構（表格、頭像、內文區等），可編輯覆寫由 plurk-post-appearance feature 常駐處理。 */
export const PostStaticStyles = () => {
  return (
    <style>
      {`
    .timeline-cnt .display table { width: 100%; }
    .plurk td { vertical-align: top; white-space: nowrap !important; }
    .td_img { width: 0; min-width: 20px; }
    .p_img, .p_img img { width: 20px; height: 20px; }
    .plurk_cnt {
      position: relative;
      font-weight: normal;
      color: #111;
      background-color: ${PLURK_POST_STYLE_DEFAULTS.backgroundColor};
      background-image: ${PLURK_POST_STYLE_DEFAULTS.backgroundImage};
      padding: 2px 0 0;
      line-height: 1.3;
      box-shadow: 1px 1px 3px -3px #000;
      border: ${PLURK_POST_STYLE_DEFAULTS.border};
    }
    .td_qual { width: auto; padding: 2px 0 2px 5px; white-space: nowrap; }
    .name { color: #111; font-weight: bold; text-decoration: none; }
    .td_cnt { width: 100%; padding: 2px 5px 5px 0; }
    .text_holder { position: relative; background: none; min-width: 48px; white-space: normal !important; word-wrap: anywhere; word-break: normal; -webkit-hyphens: auto; hyphens: auto; }
    .timeline-cnt .plurk .text_holder { width: 180px; white-space: normal; min-height: 1.3em; padding-right: 4px; max-height: 3.9em; overflow: hidden !important; }
    .timeline-cnt .display .text_holder { width: 100%; max-width: 80vw; height: auto !important; min-height: 2em; max-height: none !important; white-space: normal; min-width: 180px; }
    `}
    </style>
  );
};

/** 貼文內容與操作列的補充樣式：語氣詞、連結與圖片預覽、展開時顯示的動作列／反應／管理按鈕與時間等（不依編輯器即時覆寫的固定 UI）。 */
const PostSupplementStyles = () => (
  <style>
    {`
    .qualifier { margin-left: 2px; font-size: 12px; color: #999; }
    .q_whispers { color: #AE00B0; font-weight: bold; }
    .porn-icon { margin-left: 4px; }
    .porn-icon.pif-porn::before { content: "🔞"; font-size: 10px; }
    .timeline-cnt .porn:not(.link_extend) .text_holder { filter: blur(5px); }
    .timeline-cnt .muted { opacity: 0.4; }

    .plurk .text_holder a.hashtag { color: #e74c3c; text-decoration: none; font-weight: normal; white-space: nowrap; }
    .plurk .text_holder a.hashtag:hover { text-decoration: underline; }
    .text_holder .hashtag { white-space: nowrap; }
    .text_holder .emoticon_my { vertical-align: middle; }

    .plurk a.pictureservices { display: inline-block; margin: 4px 2px; }
    .plurk a.pictureservices img { max-height: 48px; border-radius: 4px; display: block; }
    .plurk a.pictureservices:hover img { opacity: 0.85; }

    .plurk a.meta {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 4px 8px; margin: 4px 0;
      background-color: #f5f5f5; border-radius: 6px;
      text-decoration: none; color: #333; font-size: 13px; border: 1px solid #eee;
    }
    .plurk a.meta:hover { background-color: #ebebeb; }
    .plurk a.meta img { max-height: 48px; border-radius: 4px; }

    .plurk a.ex_link { color: #3b82f6; text-decoration: none; }
    .plurk a.ex_link:hover { text-decoration: underline; }

    .plurk_cnt > table { width: 100%; }

    /* --- plurk_actions visibility --- */
    .timeline-cnt .plurk .plurk_actions { display: none; }
    .plurk_actions {
      width: 100%; box-sizing: border-box;
      align-items: center; justify-content: space-between;
      gap: 8px; margin-top: 0; padding: 6px 10px;
      border-top: 1px solid #f1f1f1;
    }
    .timeline-cnt .plurk.link_extend .plurk_actions,
    .timeline-cnt .plurk.plurk_box .plurk_actions { display: flex; }

    /* --- reactions visibility --- */
    [data-component="plurk-reactions"] { display: none; margin-top: 4px; margin-bottom: 0; min-width: 0; }
    .timeline-cnt .plurk.link_extend [data-component="plurk-reactions"],
    .timeline-cnt .plurk.plurk_box [data-component="plurk-reactions"] { display: block !important; }
    [data-component="plurk-reactions"] .reactions {
      gap: 3px; display: flex; flex-flow: row nowrap; align-items: center; overflow: hidden;
    }
    .reactions .reactions__adder {
      padding: 0 4px; cursor: pointer; color: #999;
      font-size: 13px; line-height: 18px; flex: 0 0 auto;
    }
    .reactions .reactions__adder .pif-add-reaction::before { content: "+"; }
    .reactions .reactions__adder:hover { color: #666; }
    .reaction {
      display: inline-flex; align-items: center; gap: 2px;
      padding: 0 6px; min-height: 18px; border-radius: 10px;
      background: #fff4e8; border: 1px solid #ffd2ae;
      cursor: pointer; font-size: 11px; color: #d97706;
    }
    .reaction--clicked { background: #fff4e8; }
    .reaction__emoticon { width: 13px; height: 13px; }
    .reaction__count { color: #d97706; font-size: 10px; line-height: 1; }

    /* --- manager visibility --- */
    .manager {
      display: flex; gap: 0; padding: 0;
      align-items: center; flex: 0 0 auto; margin-left: auto;
    }
    .timeline-cnt .plurk .manager { display: none; }
    .timeline-cnt .plurk.link_extend .manager,
    .timeline-cnt .plurk.plurk_box .manager { display: flex !important; }
    .manager > a {
      display: inline-flex; align-items: center; justify-content: center;
      min-width: 18px; height: 18px; color: #999;
      text-decoration: none; cursor: pointer; font-size: 12px;
      padding: 0 2px; border-radius: 3px;
    }
    .manager > a:hover { color: #555; background: rgba(0,0,0,0.06); }
    .manager > a.edit::before { content: "✎"; }
    .manager a.mute-off::before { content: "🔈"; font-size: 11px; }
    .manager a.mute-on::before { content: "🔇"; font-size: 11px; }
    .manager a.replurk::before { content: "🔄"; font-size: 11px; }
    .manager a.replurk span,
    .manager a.like span { font-size: 10px; color: #999; margin-left: 1px; }
    .manager a.replurk-on { color: #555; }

    .manager a.like-off::before { content: "♡"; }
    .manager a.like-on::before { content: "♥"; color: #e11d48; }
    .manager a.like-on { color: #555; }

    .manager a.mark-off::before { content: "⚑"; opacity: 0.55; }
    .manager a.mark-on::before { content: "⚑"; color: #b45309; }
    .manager a.mark-on { color: #555; }
    .manager > a.gift::before { content: "🎁"; font-size: 11px; }
    .manager > a.option::before { content: "⋯"; font-weight: bold; letter-spacing: -1px; }

    /* --- response count & time --- */
    .td_response_count { vertical-align: middle; padding: 0 4px; }
    /* response_count 預設保持正方形；圓角由共通編輯器寫入 timeline-cnt response_count。 */
    .response_count {
      display: inline-block; min-width: 20px; height: 20px; line-height: 20px;
      text-align: center; background-color: #FF574D; color: #fff;
      border-radius: 0; font-size: 11px; font-weight: bold; padding: 0 6px;
    }
    .new .response_count { background-color: #e53e3e; }
    .time {
      padding: 0; font-size: 10px; line-height: 18px;
      color: #999; flex: 0 1 auto; display: none;
    }
    .timeline-cnt .plurk.link_extend .time { display: none; }
    .timeline-cnt .plurk.plurk_box .time { display: block; }
    .time a { color: #999; text-decoration: none; }
    .time a:hover { text-decoration: underline; }
    .timeago { font-size: 10px; }
    `}
  </style>
);

/** 展開串文／回應區塊專用：#form_holder、回應列表、巢狀 .plurk_cnt 與底部迷你發言表單等版面。 */
const ResponseBoxStyles = () => (
  <style>
    {`
    #form_holder {
      margin-left: 20px;
      width: calc(100% - 50px) !important;
      max-width: calc(100% - 50px) !important;
      min-width: 0 !important;
      margin-top: 0; position: relative; z-index: 8;
      display: block; box-sizing: border-box;
    }
    .response_box {
      background: rgba(255, 255, 255, 1);
      border: 1px solid #d9d9d9; border-top: none;
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
      height: 284.208px; width: 100%; box-sizing: border-box;
      overflow: hidden; display: flex; flex-direction: column;
    }
    .response_info {
      display: flex; flex-direction: column; gap: 8px;
      padding: 6px 10px; border-bottom: 1px solid #ececec;
      font-size: 12px; color: #666;
    }
    .button.small-button {
      display: inline-flex; align-items: center; min-height: 22px;
      padding: 0 8px; border-radius: 11px;
      background: #fff4e8; color: #d97706; font-size: 11px;
    }
    .response-status { display: flex; align-items: center; gap: 8px; }
    .response-count { color: #999; font-size: 11px; }
    .response-display-options {
      display: inline-flex; align-items: center; gap: 4px;
      color: #999; font-size: 11px;
    }
    .list-container {
      background: #fff; height: 248px; overflow-y: auto; flex: 1 1 auto;
    }
    .response_box .list { padding: 8px 10px 0; }
    .response_box .response { position: static; margin-bottom: 8px; white-space: normal; }
    .response_box .response .plurk_cnt { background: #fafafa; border: 1px solid #eee; box-shadow: none; }
    .response_box .highlight_owner .plurk_cnt { background: #fff7ed; border-color: #fed7aa; }
    #form_holder .plurk_cnt .td_qual { position: static; padding-top: 4px; }
    .response_box .text_holder { min-width: 0; }
    .list-container__bottom-indicator { height: 8px; }

    .poster_holder {
      display: block; background: #fff;
      border: 1px solid #d9d9d9; border-top: none;
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
      width: 100%; box-sizing: border-box;
    }
    #form_holder .mini_form { padding: 7px 10px 8px; background: #fff; }
    .plurkForm.mini-mode { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
    .submit_img_color {
      display: inline-flex; align-items: center; justify-content: center;
      min-width: 58px; height: 28px; border-radius: 5px;
      background: #ff574d; color: #fff; font-size: 12px;
    }
    .input_holder { flex: 1 1 180px; min-width: 0; }
    .textarea_holder .content {
      width: 100%; min-height: 28px;
      border: 1px solid #ddd; border-radius: 4px;
      padding: 4px 6px; resize: none; font: inherit;
    }
    .icons_holder {
      display: flex; gap: 8px; padding: 0; margin: 0;
      list-style: none; color: #999;
    }
    `}
  </style>
);

export const PlurkPostStyles = () => (
  <>
    <PostStaticStyles />
    <PostSupplementStyles />
    <ResponseBoxStyles />
  </>
);
