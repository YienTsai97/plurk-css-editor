/**
 * 用途：主控台外殼在 store／匯出 CSS 使用的正式 selector（B：帶 `._lc_`）。
 *
 * Editable props:
 * - opacity
 * - backgroundColor
 * - transition
 * - border
 * - borderRadius
 * - padding
 */
export const DASHBOARD_SHELL_SELECTOR = "._lc_ #plurk-dashboard";

/**
 * 用途：主控台外殼 hover（滑鼠停留）透明度的正式 selector，須與基底同權重。
 *
 * Editable props:
 * - opacity
 */
export const DASHBOARD_SHELL_HOVER_SELECTOR = "._lc_ #plurk-dashboard:hover";
