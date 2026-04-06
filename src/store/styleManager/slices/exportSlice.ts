import type { StyleEntry, StyleManagerState } from "../types";
import { cssValueToString } from "../utils/cssValue";
import { toKebabCase } from "../utils/kebab";

export const createExportSlice = (set: any, get: any): Partial<StyleManagerState> => ({
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
