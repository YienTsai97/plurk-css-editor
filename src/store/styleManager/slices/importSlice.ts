import type { CssValue } from "@/types/css.type";
import type { CSSRule, SliceGet, SliceSet, StyleDict, StyleEntry, StyleManagerState, StyleSource } from "../types";
import { buildCssText } from "../utils/cssText";
import { cssValueToString } from "../utils/cssValue";
import { makeCssVarName } from "../utils/cssVar";

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

function removeImportedCssVars(keys: Array<{ selector: string; prop: string }>) {
  if (typeof document === "undefined") return;
  keys.forEach(({ selector, prop }) => {
    document.documentElement.style.removeProperty(makeCssVarName(selector, prop));
  });
}

/**
 * Remove imported entries from allStyles/styleSources
 * 回傳：哪些 selector/prop 被視為 imported（用來同步 current）
 */
function stripImportedTracking(state: StyleManagerState) {
  const nextAllStyles = new Map(state.allStyles);
  const nextStyleSources: StyleManagerState["styleSources"] = { ...state.styleSources };

  const importedKeys: Array<{ selector: string; prop: string }> = [];

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

  Object.keys(nextStyleSources).forEach((selector) => {
    const srcForSel = nextStyleSources[selector];
    Object.keys(srcForSel).forEach((prop) => {
      if (srcForSel[prop] === "imported") delete srcForSel[prop];
    });
    if (Object.keys(srcForSel).length === 0) delete nextStyleSources[selector];
  });

  return { nextAllStyles, nextStyleSources, importedKeys };
}

function restoreCurrentAfterImportedStrip(
  state: StyleManagerState,
  importedKeys: Array<{ selector: string; prop: string }>,
) {
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

  return nextCurrent;
}

export const createImportSlice = (set: SliceSet, get: SliceGet): Partial<StyleManagerState> => {
  return {
    importCSS: (cssRules: CSSRule[]) =>
    set((state: StyleManagerState) => {
      const cssText = buildCssText(cssRules);
      injectImportedStyleTag(cssText);

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
      return state;
    }),

  /**
   * Clear imported only:
   * - remove <style id="imported-css-styles">
   * - remove imported tracking (allStyles/styleSources)
   * - restore current to initial for imported props
   * - remove related CSS variables
   * - do not touch manual / registered
   */
  clearImportedCSS: () =>
    set((state: StyleManagerState) => {
      const { nextAllStyles, nextStyleSources, importedKeys } = stripImportedTracking(state);
      removeImportedStyleTag();
      removeImportedCssVars(importedKeys);

      return {
        current: restoreCurrentAfterImportedStrip(state, importedKeys),
        allStyles: nextAllStyles,
        styleSources: nextStyleSources,
      };
    }),

  resetImportedToInitial: () => {
    get().clearImportedCSS();
  },

  /** 用途：先清掉上一輪 imported，再套用這次匯入，避免舊規則殘留。 */
  replaceImportedCSS: (cssRules: CSSRule[]) => {
    get().clearImportedCSS();
    if (cssRules.length > 0) {
      get().importCSS(cssRules);
    }
  },

  resetAllToInitial: () =>
    set((state: StyleManagerState) => {
      const importedKeys = stripImportedTracking(state).importedKeys;
      removeImportedStyleTag();
      removeImportedCssVars(importedKeys);

      const current: StyleDict = {};
      Object.keys(state.initial).forEach((selector) => {
        current[selector] = { ...state.initial[selector] };
      });

      const allStyles = new Map<string, Map<string, StyleEntry>>();
      const styleSources: Record<string, Record<string, StyleSource>> = {};
      const now = Date.now();

      Object.entries(state.initial).forEach(([selector, props]) => {
        const nextProps = new Map<string, StyleEntry>();
        const sources: Record<string, StyleSource> = {};
        Object.entries(props).forEach(([prop, value]) => {
          if (value === undefined) return;
          nextProps.set(prop, { value, source: "registered", timestamp: now });
          sources[prop] = "registered";
        });
        allStyles.set(selector, nextProps);
        styleSources[selector] = sources;
      });

      return { current, allStyles, styleSources };
    }),
  };
};
