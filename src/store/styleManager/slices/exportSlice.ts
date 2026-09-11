import {
  DASHBOARD_SHELL_HOVER_SELECTOR,
  DASHBOARD_SHELL_SELECTOR,
} from "@/components/preview/plurk-dashboard/dashboard-shell/dashboard-shell.constants";
import { ensureDashboardShellTransitionExport } from "@/components/preview/plurk-dashboard/dashboard-shell/dashboard-shell.utils";
import type { SliceGet, SliceSet, StyleEntry, StyleManagerState } from "../types";
import { cssValueToString } from "../utils/cssValue";
import { toKebabCase } from "../utils/kebab";

export const createExportSlice = (_set: SliceSet, get: SliceGet): Partial<StyleManagerState> => ({
  getAllStyles: () => {
    const state = get() as StyleManagerState;
    const cssOutput: string[] = [];
    const tags: string[] = [];

    const sortedEntries: Array<{ selector: string; prop: string; entry: StyleEntry }> = [];

    state.allStyles.forEach((props, selector) => {
      props.forEach((entry, prop) => {
        sortedEntries.push({ selector, prop, entry });
      });
    });

    sortedEntries.sort((a, b) => a.entry.timestamp - b.entry.timestamp);

    const selectorGroups = new Map<string, Map<string, StyleEntry>>();

    sortedEntries.forEach(({ selector, prop, entry }) => {
      if (entry.source === "registered") return;

      if (!selectorGroups.has(selector)) selectorGroups.set(selector, new Map());
      selectorGroups.get(selector)!.set(prop, entry); // later overwrites earlier
    });

    // 用途：平常／hover opacity 成對匯出並補 transition，否則 Plurk 缺 :hover 或動畫。
    ensureDashboardShellTransitionExport(
      selectorGroups,
      state.current[DASHBOARD_SHELL_SELECTOR],
      state.initial[DASHBOARD_SHELL_SELECTOR],
      state.current[DASHBOARD_SHELL_HOVER_SELECTOR],
      state.initial[DASHBOARD_SHELL_HOVER_SELECTOR],
    );

    selectorGroups.forEach((props, selector) => {
      const lines: string[] = [];
      const propTags: string[] = [];

      const sortedProps = Array.from(props.entries()).sort((a, b) => a[0].localeCompare(b[0]));

      sortedProps.forEach(([prop, entry]) => {
        lines.push(`  ${toKebabCase(prop)}: ${cssValueToString(entry.value)};`);

        if (entry.source === "imported") propTags.push(`[IMPORTED] ${prop}`);
        if (entry.source === "manual") propTags.push(`[MANUAL] ${prop}`);
      });

      if (lines.length > 0) {
        if (propTags.length > 0) {
          cssOutput.push(`/* ${propTags.join(" ")} */\n${selector} {\n${lines.join("\n")}\n}`);
        } else {
          cssOutput.push(`${selector} {\n${lines.join("\n")}\n}`);
        }
      }
    });

    tags.push("/* ===== CSS EXPORT TAGS ===== */");
    tags.push("/* [MANUAL]   - 用戶手動調整（最高優先級） */");
    tags.push("/* [IMPORTED] - 外部 CSS 導入（中等優先級） */");
    tags.push("/* 注意：相同屬性的後續值會覆蓋前面的值 */");
    tags.push("/* ========================== */");

    return { css: cssOutput.join("\n\n"), tags };
  },
});
