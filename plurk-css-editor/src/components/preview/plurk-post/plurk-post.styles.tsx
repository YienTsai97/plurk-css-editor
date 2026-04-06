type StyleProps = {
  bgColor: string;
  bgImage: string;
  border: string;
  nameColor: string;
  hasManualChanges: boolean;
  bgColorChanged: boolean;
  bgImageChanged: boolean;
  borderChanged: boolean;
  nameColorChanged: boolean;
}

// 靜態樣式組件
export const StaticStyles = ({ bgColor, bgImage, border }: Pick<StyleProps, 'bgColor' | 'bgImage' | 'border'>) => (
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
      background-color: ${bgColor};
      background-image: ${bgImage};
      padding: 2px 0 0;
      line-height: 1.3;
      box-shadow: 1px 1px 3px -3px #000;
      border: ${border}
    }
    .td_qual { width: auto; padding: 2px 0 2px 5px; white-space: nowrap; }
    .name { color: #111; font-weight: bold; text-decoration: none; }
    .td_cnt { width: 100%; padding: 2px 5px 5px 0; }
    .text_holder { position: relative; background: none; min-width: 48px; white-space: normal !important; word-wrap: anywhere; word-break: normal; -webkit-hyphens: auto; hyphens: auto; }
    .timeline-cnt .plurk .text_holder { width: 180px; white-space: normal; min-height: 1.3em; padding-right: 4px; height: auto; overflow: hidden !important; }
    .timeline-cnt .display .text_holder { width: 100%; max-width: 80vw; height: auto !important; min-height: 2em; max-height: none !important; white-space: normal; min-width: 180px; }
    .timeline-cnt .plurk [data-component="plurk-reactions"], .timeline-cnt .plurk .manager { display: none; }
    .link_extend [data-component="plurk-reactions"], .plurk_box [data-component="plurk-reactions"], .link_extend .manager, .plurk_box .manager { display: block !important; }
    plurk-reactions { display: block; margin: 0.5rem 0; }
    plurk-reactions .reactions { gap: 4px; display: flex; flex-flow: row wrap; }
    plurk-reactions .reactions__adder { padding-left: 8px; }
    `}
  </style>
);

// 高特異性樣式組件 - 只覆蓋有變化的屬性
export const HighSpecificityStyles = ({
  bgColor,
  bgImage,
  border,
  nameColor,
  bgColorChanged,
  bgImageChanged,
  borderChanged,
  nameColorChanged,
  hasManualChanges
}: StyleProps) => {
  // 如果沒有任何變化，不渲染
  if (!hasManualChanges) return null;

  return (
    <style>
      {`
      ${bgColorChanged ? `
      body#pcg .plurk_cnt.plurk_cnt.plurk_cnt {
        background-color: ${bgColor};
      }` : ''}

      ${bgImageChanged ? `
      body#pcg .plurk_cnt.plurk_cnt.plurk_cnt {
        background-image: ${bgImage};
      }` : ''}
      
      ${borderChanged ? `
      body#pcg .plurk_cnt.plurk_cnt.plurk_cnt {
        border: ${border};
      }` : ''}
      
      ${nameColorChanged ? `
      body#pcg .name.name.name {
        color: ${nameColor};
      }` : ''}
      `}
    </style>
  );
};

// 樣式組件組合器
export const PlurkPostStyles = (props: StyleProps) => (
  <>
    <StaticStyles bgColor={props.bgColor} bgImage={props.bgImage} border={props.border} />
    <HighSpecificityStyles {...props} />
  </>
);
