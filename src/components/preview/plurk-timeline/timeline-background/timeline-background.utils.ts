/** 用途：將圖片網址轉成 CSS background-image 可用的值。 */
export function toBackgroundImageCssValue(href: string): string {
  const v = href.trim();
  if (v === "" || v === "none") return "none";
  if (v.includes('"')) {
    return `url('${v.replace(/'/g, "\\'")}')`;
  }
  return `url("${v}")`;
}
