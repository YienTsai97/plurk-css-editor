import {
  DASHBOARD_SHELL_HOVER_STYLE_DEFAULTS,
  DASHBOARD_SHELL_STYLE_DEFAULTS,
} from "@/store/styleManager/defaults";
import { cssValueToString } from "@/store/styleManager/utils/cssValue";
import type { CssValue } from "@/types/css.type";
import {
  DASHBOARD_SHELL_HOVER_SELECTOR,
  DASHBOARD_SHELL_SELECTOR,
} from "./dashboard-shell.constants";

type ExportStyleEntry = {
  value: CssValue;
  source: "registered" | "imported" | "manual";
  timestamp: number;
};

type ShellProps = Record<string, CssValue | undefined> | undefined;

/** 用途：把目前／預設值寫進匯出 Map（不覆寫已有 manual／imported）。 */
function ensureExportedProp(
  props: Map<string, ExportStyleEntry>,
  prop: string,
  value: CssValue,
): void {
  if (props.has(prop)) return;
  props.set(prop, {
    value,
    source: "manual",
    timestamp: Date.now(),
  });
}

/**
 * 用途：匯出主控台外殼時，若有平常或 hover opacity，成對補上另一側 opacity，
 * 並補 transition。否則預覽有 hover 變化，但 registered 預設不會進 getAllStyles，
 * Plurk 實站會缺 `:hover` 或缺少透明度動畫。
 * 會直接改寫傳入的 selectorGroups。
 */
export function ensureDashboardShellTransitionExport(
  selectorGroups: Map<string, Map<string, ExportStyleEntry>>,
  currentShellProps: ShellProps,
  initialShellProps: ShellProps,
  currentHoverProps?: ShellProps,
  initialHoverProps?: ShellProps,
): void {
  const shellProps = selectorGroups.get(DASHBOARD_SHELL_SELECTOR);
  const hoverProps = selectorGroups.get(DASHBOARD_SHELL_HOVER_SELECTOR);

  const opacityExported =
    Boolean(shellProps?.has("opacity")) || Boolean(hoverProps?.has("opacity"));
  if (!opacityExported) return;

  const nextShell = shellProps ?? new Map<string, ExportStyleEntry>();
  if (!shellProps) {
    selectorGroups.set(DASHBOARD_SHELL_SELECTOR, nextShell);
  }

  const nextHover = hoverProps ?? new Map<string, ExportStyleEntry>();
  if (!hoverProps) {
    selectorGroups.set(DASHBOARD_SHELL_HOVER_SELECTOR, nextHover);
  }

  const baseOpacity =
    cssValueToString(
      currentShellProps?.opacity ?? initialShellProps?.opacity,
    ).trim() || DASHBOARD_SHELL_STYLE_DEFAULTS.opacity;
  ensureExportedProp(nextShell, "opacity", baseOpacity);

  const hoverOpacity =
    cssValueToString(
      currentHoverProps?.opacity ?? initialHoverProps?.opacity,
    ).trim() || DASHBOARD_SHELL_HOVER_STYLE_DEFAULTS.opacity;
  ensureExportedProp(nextHover, "opacity", hoverOpacity);

  if (nextShell.has("transition")) return;

  const transitionValue =
    currentShellProps?.transition ??
    initialShellProps?.transition ??
    DASHBOARD_SHELL_STYLE_DEFAULTS.transition;

  nextShell.set("transition", {
    value:
      cssValueToString(transitionValue) ||
      DASHBOARD_SHELL_STYLE_DEFAULTS.transition,
    source: "manual",
    timestamp: Date.now(),
  });
}
