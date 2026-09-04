import { BODY_STYLE_DEFAULTS } from "@/store/styleManager/defaults";
import { cssValueToString } from "@/store/styleManager/utils/cssValue";
import type { EditorPageStyleProps } from "./page.type";

export const EditorPageStyle = ({
  backgroundImage,
  backgroundSize,
  backgroundRepeat,
  backgroundPosition,
  backgroundAttachment,
  backgroundImageChanged,
  backgroundSizeChanged,
  backgroundRepeatChanged,
}: EditorPageStyleProps) => {
  const bi = cssValueToString(backgroundImage) || BODY_STYLE_DEFAULTS.backgroundImage;
  const bs = cssValueToString(backgroundSize) || BODY_STYLE_DEFAULTS.backgroundSize;
  const br = cssValueToString(backgroundRepeat) || BODY_STYLE_DEFAULTS.backgroundRepeat;
  const bp = cssValueToString(backgroundPosition) || BODY_STYLE_DEFAULTS.backgroundPosition;
  const ba = cssValueToString(backgroundAttachment) || BODY_STYLE_DEFAULTS.backgroundAttachment;

  const highSpecParts = [
    backgroundImageChanged && `background-image: ${bi}`,
    (backgroundImageChanged || backgroundSizeChanged) && `background-size: ${bs}`,
    (backgroundImageChanged || backgroundRepeatChanged) && `background-repeat: ${br}`,
  ].filter(Boolean);

  const showHighSpec =
    backgroundImageChanged ||
    backgroundSizeChanged ||
    backgroundRepeatChanged;

  return (
    <>
      <style>
        {`
    body {
      background: #eeebf0;
      color: #333;
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
      overflow-y: scroll;
    }
    body, div, dl, dt, dd, ul, ol, li, h1, h2, h3, h4, h5, h6, pre, code, form, fieldset, legend, input, textarea, p, blockquote, th, td {
      margin: 0;
      padding: 0;
    }
    body.language-large-font {
      font-size: 13px;
    }
    #layout_body {
      position: relative;
    }
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
      {showHighSpec ? (
        <style>{`html body { ${highSpecParts.join("; ")}; }`}</style>
      ) : null}
    </>
  );
};
