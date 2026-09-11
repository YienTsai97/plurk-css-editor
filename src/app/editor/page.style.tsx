import { TIMELINE_BACKGROUND_EXPORT_SHELL } from "@/components/preview/plurk-timeline/timeline-background/timeline-background.constants";
import { BODY_STYLE_DEFAULTS } from "@/store/styleManager/defaults";
import { cssValueToString } from "@/store/styleManager/utils/cssValue";
import type { EditorPageStyleProps } from "./page.type";

const shell = TIMELINE_BACKGROUND_EXPORT_SHELL;

export const EditorPageStyle = ({
  backgroundImage,
  backgroundSize,
  backgroundRepeat,
  backgroundPosition,
  backgroundAttachment,
}: EditorPageStyleProps) => {
  const bi = cssValueToString(backgroundImage) || BODY_STYLE_DEFAULTS.backgroundImage;
  const bs = cssValueToString(backgroundSize) || BODY_STYLE_DEFAULTS.backgroundSize;
  const br = cssValueToString(backgroundRepeat) || BODY_STYLE_DEFAULTS.backgroundRepeat;
  const bp = cssValueToString(backgroundPosition) || BODY_STYLE_DEFAULTS.backgroundPosition;
  const ba = cssValueToString(backgroundAttachment) || BODY_STYLE_DEFAULTS.backgroundAttachment;

  return (
    <style>
      {`
    html, body {
    font: 12px / 18px 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans Regular', Tahoma, Verdana, sans-serif;
    position: relative;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    }
    #background_layout{
      position: ${shell.position};
      width: ${shell.width};
      height: ${shell.height};
      top: ${shell.top};
      left: ${shell.left};
      z-index: ${shell.zIndex};
      background-color: ${shell.backgroundColor};
      background-image: ${bi};
      background-size: ${bs}; /* 強制滿版*/
      background-position: ${bp}; /* 置中裁切 */
      background-repeat: ${br}; /* 重複填充 */
      background-attachment: ${ba}; /* 可選：滾動時背景不動 */
    }
    body.language-large-font {
      font-size: 13px;
    }
    body, #layout_content_html, #layout_content {
      overflow-x: hidden;
    }
    body {
      background: #eeebf0;
      color: #333;
      overflow-y: scroll;
    }
    body, div, dl, dt, dd, ul, ol, li, h1, h2, h3, h4, h5, h6, pre, code, form, fieldset, legend, input, textarea, p, blockquote, th, td {
      margin: 0;
      padding: 0;
    }
    body.language-large-font {
      font-size: 13px;
    }
    /* 用途：讓 sticky 頂欄有完整高度可點；內容層自己做 stacking，避免蓋住 #top_bar。 */
    #layout_body {
      position: relative;
      height: 100%;
    }
    /* 用途：預覽容器預設不攔點擊，子元素再開啟，頂欄連結才點得到。 */
    #layout_content_html,
    #layout_content {
      pointer-events: none;
    }
    #layout_content {
      padding-top: 0;
      position: relative;
      z-index: 0;
      isolation: isolate;
    }
    #layout_content > * {
      pointer-events: auto;
    }
    .clearfix {
      clear: both;
    }
    .clearfix::after {
      content: '';
      clear: both;
      width: 0px;
      height: 0px;
      display: block;
      line-height: 0px;
      font-size: 0px;
    }
    i {
      font-style: normal;
    }

  `}
    </style>
  );
};
