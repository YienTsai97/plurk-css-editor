import type { CSSRule, SliceGet, SliceSet, StyleEntry, StyleManagerState } from "../types";
import { buildCssText } from "../utils/cssText";
import { cssValueToString } from "../utils/cssValue";
import { makeCssVarName } from "../utils/cssVar";
import type { CssValue } from "@/types/css.type";

const IMPORTED_STYLE_TAG_ID = "imported-css-styles";

function removeImportedStyleTag() {
  if (typeof document === "undefined") return;
  const el = document.getElementById(IMPORTED_STYLE_TAG_ID);
  if (el) el.remove();
}

function injectImportedStyleTag(cssText: string) {
  if (typeof document === "undefined") return;

  removeImportedStyleTag();

  const styleEl = document.createElement("style");
  styleEl.id = IMPORTED_STYLE_TAG_ID;
  styleEl.textContent = cssText;
  document.head.appendChild(styleEl);
}

/**
 * Remove imported entries from allStyles/styleSources
 * 回傳：哪些 selector/prop 被視為 imported（用來同步 current）
 */
function stripImportedTracking(state: StyleManagerState) {
  const nextAllStyles = new Map(state.allStyles);
  const nextStyleSources: StyleManagerState["styleSources"] = { ...state.styleSources };

  const importedKeys: Array<{ selector: string; prop: string }> = [];

  // allStyles: remove imported entries
  nextAllStyles.forEach((propsMap, selector) => {
    const nextProps = new Map<string, StyleEntry>();
    propsMap.forEach((entry, prop) => {
      if (entry.source === "imported") {
        importedKeys.push({ selector, prop });
        return;
      }
      nextProps.set(prop, entry);
    });

    if (nextProps.size > 0) nextAllStyles.set(selector, nextProps);
    else nextAllStyles.delete(selector);
  });

  // styleSources: remove imported marks
  Object.keys(nextStyleSources).forEach((selector) => {
    const srcForSel = nextStyleSources[selector];
    Object.keys(srcForSel).forEach((prop) => {
      if (srcForSel[prop] === "imported") delete srcForSel[prop];
    });
    if (Object.keys(srcForSel).length === 0) delete nextStyleSources[selector];
  });

  return { nextAllStyles, nextStyleSources, importedKeys };
}

export const createImportSlice = (set: SliceSet, _get: SliceGet): Partial<StyleManagerState> => {
  void _get;
  return {
    importCSS: (cssRules: CSSRule[]) =>
    set((state: StyleManagerState) => {
      // 1) DOM injection
      const cssText = buildCssText(cssRules);
      injectImportedStyleTag(cssText);

      // 2) state updates
      const nextCurrent: StyleManagerState["current"] = { ...state.current };
      const nextAllStyles = new Map(state.allStyles);
      const nextStyleSources: StyleManagerState["styleSources"] = { ...state.styleSources };

      const now = Date.now();

      cssRules.forEach(({ selector, properties }) => {
        if (!nextCurrent[selector]) nextCurrent[selector] = {};
        if (!nextStyleSources[selector]) nextStyleSources[selector] = {};
        if (!nextAllStyles.has(selector)) nextAllStyles.set(selector, new Map());

        const selectorMap = nextAllStyles.get(selector)!;

        Object.entries(properties).forEach(([prop, value]) => {
          // NOTE: properties is Record<string, CssValue>, prop may not be StyleKey strictly
          // 你若想更嚴格：可以改 CSSRule 的 properties key 為 Partial<Record<StyleKey, CssValue>>
          nextCurrent[selector] = {
            ...nextCurrent[selector],
            [prop]: value,
          };

          nextStyleSources[selector][prop] = "imported";

          selectorMap.set(prop, {
            value,
            source: "imported",
            timestamp: now,
          });

          // optional: also set css var for fast override
          const varName = makeCssVarName(selector, prop);
          if (typeof document !== "undefined") {
            document.documentElement.style.setProperty(varName, cssValueToString(value));
          }
        });
      });

      return {
        current: nextCurrent,
        allStyles: nextAllStyles,
        styleSources: nextStyleSources,
      };
    }),

  setCSSVariable: (selector: string, prop: string, value: CSSRule["properties"][string]) =>
    set((state: StyleManagerState) => {
      const varName = makeCssVarName(selector, prop);
      if (typeof document !== "undefined") {
        document.documentElement.style.setProperty(varName, cssValueToString(value));
      }
      return state; // no state change
    }),

  /**
   * Clear imported:
   * - remove <style id="imported-css-styles">
   * - remove imported tracking (allStyles/styleSources)
   * - remove imported props from current (delete only)
   */
  clearImportedCSS: () =>
    set((state: StyleManagerState) => {
      removeImportedStyleTag();

      const { nextAllStyles, nextStyleSources, importedKeys } = stripImportedTracking(state);

      // sync current: delete imported props (do not force revert to initial)
      const nextCurrent: StyleManagerState["current"] = { ...state.current };

      importedKeys.forEach(({ selector, prop }) => {
        const curSel = nextCurrent[selector];
        if (!curSel) return;

        const nextSel = { ...curSel } as Record<string, CssValue>;
        delete nextSel[prop];
        nextCurrent[selector] = nextSel;
      });

      return {
        current: nextCurrent,
        allStyles: nextAllStyles,
        styleSources: nextStyleSources,
      };
    }),

  /**
   * Clear imported + restore initial:
   * - remove style tag
   * - remove imported tracking
   * - for each imported prop:
   *   - if initial has that prop -> set current to initial value
   *   - else -> delete from current
   */
  resetImportedToInitial: () =>
    set((state: StyleManagerState) => {
      removeImportedStyleTag();

      const { nextAllStyles, nextStyleSources, importedKeys } = stripImportedTracking(state);

      const nextCurrent: StyleManagerState["current"] = { ...state.current };

      importedKeys.forEach(({ selector, prop }) => {
        const curSel = nextCurrent[selector];
        if (!curSel) return;

        const initialVal = (state.initial[selector] as Record<string, CssValue> | undefined)?.[prop];

        if (initialVal !== undefined) {
          nextCurrent[selector] = { ...curSel, [prop]: initialVal };
        } else {
          const nextSel = { ...curSel } as Record<string, CssValue>;
          delete nextSel[prop];
          nextCurrent[selector] = nextSel;
        }
      });

      return {
        current: nextCurrent,
        allStyles: nextAllStyles,
        styleSources: nextStyleSources,
      };
    }),
  };
};
