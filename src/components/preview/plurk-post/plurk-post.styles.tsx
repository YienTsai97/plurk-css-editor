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
    /* 實站 .td_qual 為 width: 0%，暱稱格才會縮到內容寬並與內文同行。 */
    .td_qual { width: 0%; padding: 2px 0 2px 5px; white-space: nowrap; text-align: center; }
    .name { color: #111; font-weight: bold; text-decoration: none; }
    .timeline-cnt .plurk a.name.has-name-color {
      color: var(--name-color, #111) !important;
    }
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
    .qualifier {
      padding: 0 3px;
      color: #FFF;
      margin: 0 3px 0 4px;
      border-radius: 3px;
      font-size: 12px;
    }
    .q_whispers { background-color: #32007e; }
    .porn-icon { margin: 0 4px 0 1px; display: inline-flex; vertical-align: middle; line-height: 0; }
    .timeline-cnt .porn:not(.link_extend) .text_holder { filter: blur(5px); }
    .timeline-cnt .muted { opacity: 0.4; }

    .plurk .text_holder a.hashtag { color: #e74c3c; text-decoration: none; font-weight: normal; white-space: nowrap; }
    .plurk .text_holder a.hashtag:hover { text-decoration: underline; }
    .text_holder .hashtag { white-space: nowrap; }
    .text_holder .emoticon_my {
      display: inline;
      vertical-align: middle;
      height: 1.3em;
      width: auto;
    }

    .plurk a.pictureservices {
      display: inline-block; max-width: 200px; overflow: hidden; border: none;
      vertical-align: text-top; cursor: pointer; margin: 1px 2px 4px 0; position: relative;
    }
    .plurk a.pictureservices img { height: 64px; display: block; max-width: 240px; }
    .plurk a.pictureservices:hover img { filter: brightness(90%); }

    /* 實站 a.meta 為 block，連結卡才會自成一行，首行只留暱稱與內文。 */
    .plurk a.meta {
      display: block; position: relative; cursor: pointer;
      margin: 1px 0 4px; padding: 4px; overflow: hidden;
      color: #2153D2; text-decoration: none;
      border-radius: 7px;
      background: rgba(33, 83, 210, 0.04);
      border: rgba(33, 83, 210, 0.08) 1px solid;
    }
    .plurk a.meta:hover { background: rgba(33, 83, 210, 0.08); border-color: rgba(33, 83, 210, 0.12); }
    .plurk a.meta img { border-radius: 5px; float: left; height: 48px; margin: 0 5px 0 0; max-width: 80px; }

    .plurk a.ex_link { color: #3b82f6; text-decoration: none; }
    .plurk a.ex_link:hover { text-decoration: underline; }

    .plurk_cnt > table { width: 100%; }

    /* --- plurk_actions visibility --- */
    .timeline-cnt .plurk .plurk_actions { display: none; }
    .plurk_actions {
      width: 100%; box-sizing: border-box;
      align-items: center; justify-content: space-between;
      gap: 8px; margin-top: 0; padding: 6px 10px;
      border-bottom: 1px solid #f1f1f1;
    }
    .timeline-cnt .plurk.link_extend .plurk_actions,
    .timeline-cnt .plurk.plurk_box .plurk_actions { display: flex; }

    /* --- reactions visibility --- */
    [data-component="plurk-reactions"] { display: none; margin: 0.5rem 0; min-width: 0; }
    .timeline-cnt .plurk.link_extend [data-component="plurk-reactions"],
    .timeline-cnt .plurk.plurk_box [data-component="plurk-reactions"] { display: block !important; }
    [data-component="plurk-reactions"] .reactions {
      gap: 4px; display: flex; flex-flow: row wrap; align-items: center;
    }
    .reactions .reactions__adder {
      padding: 4px 8px; gap: 4px; border-radius: 100px;
      display: inline-flex; flex-flow: row nowrap; align-items: center; justify-content: center;
      height: 22px; color: #A1A6B5; font-size: 13px;
      background: rgba(175, 184, 204, 0.2); cursor: pointer;
    }
    .reactions .reactions__adder:hover { color: #FFF; background: #AFB8CC; }
    .reaction {
      padding: 4px 8px; gap: 4px; border-radius: 100px;
      display: flex; flex-flow: row nowrap; align-items: center;
      min-height: 22px; color: #848CA4;
      background: rgba(175, 184, 204, 0.2); cursor: pointer;
    }
    .reaction--clicked { color: #FFF; background: #ff9b65; }
    .reaction__emoticon { min-width: 14px; max-height: 14px; }
    .reaction__count { font-size: 13px; line-height: 13px; }

    /* --- manager visibility --- */
    /* manager 圖示：自製 SVG，保留 class 供 CSS 編輯器 selector 對照。 */
    .manager {
      display: flex; gap: 0; padding: 3px 4px 0; margin-top: 4px;
      align-items: center; flex: 0 0 auto; margin-left: auto; color: #AFB8CC;
    }
    .timeline-cnt .plurk .manager { display: none; }
    .timeline-cnt .plurk.link_extend .manager,
    .timeline-cnt .plurk.plurk_box .manager { display: flex !important; }
    .manager > a {
      display: inline-flex; align-items: center; gap: 2px;
      margin-left: 12px; color: #AFB8CC;
      border-radius: 3px; padding: 2px 5px 3px; font-size: 14px;
      text-decoration: none !important; cursor: pointer;
    }
    .manager > a svg { display: block; flex-shrink: 0; }
    .manager > a:first-child { margin-left: 0; }
    .manager > a.gift { margin-left: 10px; }
    .manager > a > span { margin-left: 3px; font-size: 12px; }
    .manager > a:hover { color: #FFF !important; background: #3667A5 !important; }

    .manager .mute-on { color: #000 !important; }
    .manager .mute-on:hover { background: #3667A5 !important; }
    .manager .mute-off:hover { background: #000 !important; }
    .manager .replurk-on { color: #45b03f !important; }
    .manager .replurk-on:hover { background: #444 !important; }
    .manager .replurk-off:hover { background: #45b03f !important; }
    .manager .like-on { color: #e8443d !important; }
    .manager .like-on:hover { background: #444 !important; }
    .manager .like-off:hover { background: #e8443d !important; }
    .manager .mark-on { color: #5abac5 !important; }
    .manager .mark-on:hover { background: #444 !important; }
    .manager .mark-off:hover { background: #5abac5 !important; }

    /* --- response count & time --- */
    .td_response_count { vertical-align: middle; padding: 0; }
    /* response_count 預設保持正方形；圓角由共通編輯器寫入 timeline-cnt response_count。 */
    .response_count {
      display: inline-block; height: 20px; line-height: 20px;
      text-align: center; background-color: #D5D3D7; color: #fff;
      border-radius: 0; font-size: 11px; font-weight: bold; padding: 1px 4px; width:min-content;
    }
    .new .response_count { background-color: #FB0047;}
    .time {
      padding: 0; font-size: 12px; line-height: 18px;
      color: #AFB8CC; flex: 0 1 auto; display: none;
    }
    .timeline-cnt .plurk.link_extend .time { display: none; }
    .timeline-cnt .plurk.plurk_box .time { display: block; }
    .time a { color: #AFB8CC; text-decoration: none; }
    .time a:hover { color: #8F98AC; }
    .timeago { color: #9F9F9F; font-size: 12px; }
    `}
  </style>
);

/** 展開串文／回應區塊專用：#form_holder、回應列表、巢狀 .plurk_cnt 與底部迷你發言表單等版面。 */
const ResponseBoxStyles = () => (
  <style>
    {`
    #form_holder {
      margin-left: 20px;
      width: 464px;
      // max-width: calc(100% - 50px) !important;
      // min-width: 0 !important;
      margin-top: 0; position: relative; z-index: 8;
      display: block; box-sizing: border-box;
    }
    .response_box {
      position: relative; background: #fff;
      border: 1px solid #eee; border-top: none;
      min-height: 260px; width: 100%; box-sizing: border-box;
      overflow: auto; overflow-x: hidden;
    }

    /* --- response_info：喜歡／互動徽章與回應狀態列（實站為 float 排列） --- */
    .response_info { display: flex; flex-wrap: wrap; }
    .response_info:after { content: ''; clear: both; height: 0; display: block; }
    .response_info .button {
      border: 0; width: auto; vertical-align: middle; cursor: pointer;
      outline: none; box-shadow: none; border-radius: 999px;
      display: inline-block; font-weight: bold;
      background: #FF574D; color: #fff; padding: 9px 13px; font-size: 13px; line-height: 1;
    }
    .response_info .button.small-button { font-size: 12px; padding: 6px 10px; }
    .response_info .favorite_count,
    .response_info .replurk_count { margin: 9px 0 4px 10px; color: #fff; float: left; }
    .response_info .favorite_count { background: #54a4be; }
    .response_info .favorite_count:hover { background: #4494ae; }
    .response_info .replurk_count { background: #56b892; }
    .reaction_count .button { margin: 9px 0 4px 10px; color: #FFF; float: left; background: #ff9b65; }
    .reaction_count .button:hover { background: #b1653d; }

    .response-status {
      clear: both; display: flex; flex-flow: row wrap; align-items: center;
      width: 100%; margin-top: 5px; padding: 4px 0; font-size: 12px;
    }
    .response-status .response-count {
      color: #afb8cc; background-color: transparent; font-weight: normal;
      margin-left: 10px; height: 24px; line-height: 24px;
      display: inline-flex; align-items: center; gap: 4px;
    }
    /* 實站預設隱藏「回應顯示方式」，滑到狀態列才淡入。 */
    .response-status .response-display-options {
      padding: 2px 8px; gap: 4px; border-radius: 100px;
      display: inline-flex; flex-flow: row nowrap; align-items: center;
      margin-left: 20px; color: #AFB8CC; font-weight: normal;
      background: #F5F5F9; border: none; cursor: pointer; opacity: 0;
    }
    .response-status:hover .response-display-options { opacity: 1; }
    .response-status .response-display-options:hover { color: #FFF; background: #AFB8CC; }
    .response-status .response-display-options__prefix { width: 14px; height: 14px; font-size: 14px; line-height: 1; }
    .response-status .response-display-options__suffix { width: 10px; height: 10px; font-size: 10px; line-height: 1; }
    .response-status .response-display-options__label { font-size: 12px; line-height: 150%; }

    /* --- 回應列表：實站沒有氣泡底色，本人回應只有暱稱加底線 --- */
    .response_box .list { padding: 5px; position: relative; clear: both; height: auto !important; }
    .response_box .list .plurk { position: relative; margin: 3px 0; white-space: normal; }
    /* 不覆寫 background：實站回應的 .plurk_cnt 會跟著使用者自訂的貼文底色。 */
    .response_box .list .plurk_cnt {
      padding-bottom: 0; box-shadow: none; border: none;
    }
    .response_box .list .td_qual { width: 0%; }
    .response_box .list .td_cnt { width: 100%; }
    .response_box .list .text_holder {
      white-space: normal !important; word-break: break-word !important;
      width: 100% !important; min-width: 0; margin-right: 5px;
    }
    .highlight_owner .name { text-decoration: underline; }
    .list-container__bottom-indicator { height: 8px; }

    /* --- 底部迷你回應表單 --- */
    .poster_holder {
      display: block; background: #fff;
      border: 1px solid #eee; border-top: none;
      width: 100%; box-sizing: border-box;
    }
    #form_holder .mini_form {
      padding: 4px 3px 2px; border-top: #eee 1px solid;
      background: #fff; font-weight: normal;
    }
    #form_holder .plurkForm { padding: 3px 3px 0; position: relative; }
    #form_holder .plurkForm:after, .icons_holder:after {
      content: ''; clear: both; height: 0; display: block;
    }
    /* 實站 mini_form 不顯示 Plurk 送出鈕，改以「按 Enter 送出」提示。 */
    .mini_form .submit_img { display: none !important; }
    .submit_img_color { background: #FF574D; }
    .input_holder {
      border: rgba(0, 0, 0, 0.1) 1px solid; border-radius: 6px;
      background: #FFF; overflow: hidden; display: flex; flex-wrap: wrap;
    }
    .qual_holder { padding: 1px 1px 0; font-size: 12px; flex: 0 0 auto; order: -3; }
    .m_qualifier {
      display: inline-flex; align-items: center; justify-content: center;
      padding: 3px 6px 2px; color: #FFF;
      position: relative; border-radius: 5px; line-height: 100%;
      background-color: #CCC; cursor: pointer;
    }
    .textarea_holder { overflow: hidden; flex: 1 0 4px; order: -2; }
    .textarea_holder .content {
      width: 100%; background: #FFF; border: 0; box-shadow: none; outline: none;
      padding: 0 2px; margin: 0; resize: none; font-family: inherit;
      font-size: 12px; line-height: 19px; height: 19px; border-radius: 4px;
    }
    .icons_holder {
      margin: 1px 0 3px; overflow: hidden; float: left;
      display: flex; list-style: none; padding: 0; font-size: 12px;
    }
    .icons_holder li {
      margin: 1px 1px 0 0; cursor: pointer; position: relative;
      width: 26px; text-align: center; line-height: 24px; font-size: 16px;
      display: inline-flex; align-items: center; justify-content: center;
      list-style: none;
    }
    .char_updater {
      clear: none; float: right; text-align: right;
      margin: 4px 5px 0; color: #aeaeae; font-size: 12px; line-height: 18px;
    }
    .char_updater .press-enter { font-size: 12px; line-height: 150%; color: #aeaeae; }
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
