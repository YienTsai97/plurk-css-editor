/**
 * 用途：定義已讀回應數徽章在 store / 匯出 CSS 使用的正式 selector。
 *
 * 回應數徽章（已讀）的匯出 selector。
 *
 * Editable props:
 * - backgroundColor
 * - color
 * - fontSize
 * - opacity
 * - borderRadius（已讀／未讀共用）
 * - border
 * - boxShadow
 */
export const RESPONSE_COUNT_SELECTOR = ".timeline-cnt .response_count";

/**
 * 用途：定義未讀回應數徽章在 store / 匯出 CSS 使用的正式 selector。
 *
 * 回應數徽章（未讀）的匯出 selector。
 *
 * Editable props:
 * - backgroundColor
 * - color
 * - opacity
 */
export const RESPONSE_COUNT_NEW_SELECTOR = ".timeline-cnt .new .response_count";
