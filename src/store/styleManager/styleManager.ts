"use client";
import { CssValue, StyleKey } from "@/types/css.type";
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

type StyleProps = Partial<Record<StyleKey, CssValue>>
type StyleDict = Record<string, StyleProps>

// 新增：樣式來源追蹤
type StyleSource = 'registered' | 'imported' | 'manual';

type StyleEntry = {
  value: CssValue;
  source: StyleSource;
  timestamp: number;
}

const RESPONSE_COUNT_EXPORT_SELECTOR = ".timeline-cnt .response_count";
const RESPONSE_COUNT_NEW_EXPORT_SELECTOR = ".timeline-cnt .new .response_count";

const toCssPropName = (prop: string) => prop.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());

const getSourceTag = (prop: string, source: StyleSource) => {
  if (source === "imported") return `[IMPORTED] ${prop}`;
  if (source === "manual") return `[MANUAL] ${prop}`;
  return null;
};

const formatCssBlock = (
  selector: string,
  props: Map<string, StyleEntry>,
  extraTags: string[] = [],
) => {
  const lines: string[] = [];
  const propTags: string[] = [...extraTags];
  const sortedProps = Array.from(props.entries()).sort((a, b) => a[0].localeCompare(b[0]));

  sortedProps.forEach(([prop, entry]) => {
    lines.push(`  ${toCssPropName(prop)}: ${entry.value};`);

    const sourceTag = getSourceTag(prop, entry.source);
    if (sourceTag) {
      propTags.push(sourceTag);
    }
  });

  if (lines.length === 0) return null;

  const body = `${selector} {\n${lines.join("\n")}\n}`;
  return propTags.length > 0 ? `/* ${propTags.join(" ")} */\n${body}` : body;
};

const buildCurrentStyleEntries = (
  currentProps: StyleProps | undefined,
  sourceProps: Map<string, StyleEntry> | undefined,
) => {
  const entries = new Map<string, StyleEntry>();
  if (!currentProps) return entries;

  Object.entries(currentProps).forEach(([prop, value]) => {
    if (value === undefined) return;

    const sourceEntry = sourceProps?.get(prop);
    entries.set(prop, {
      value,
      source: sourceEntry?.source ?? "registered",
      timestamp: sourceEntry?.timestamp ?? 0,
    });
  });

  return entries;
};

type StyleManagerState = {
  current: StyleDict,
  initial: StyleDict,
  // 新增：樣式來源追蹤
  styleSources: Record<string, Record<string, StyleSource>>,
  // 新增：所有樣式變化（包括未登錄的）
  allStyles: Map<string, Map<string, StyleEntry>>,

  //Initialize
  setInitialBatch: (selector: string, init: StyleProps) => void
  setProp: (selector: string, prop: StyleKey, value: CssValue) => void

  // 新增：CSS 導入功能
  importCSS: (cssRules: Array<{ selector: string; properties: Record<string, CssValue> }>) => void

  // 新增：設置 CSS 變數（高效覆蓋樣式）
  setCSSVariable: (selector: string, prop: string, value: CssValue) => void

  // 新增：清除導入的 CSS 樣式
  clearImportedCSS: () => void
  // 新增：清除導入並回復 initial
  resetImportedToInitial: () => void

  //Read (hook)
  getProp: (selector: string, prop: StyleKey) => CssValue | undefined
  getInitial: (selector: string, prop: StyleKey) => CssValue | undefined

  // 新增：獲取所有樣式（用於 export）
  getAllStyles: () => { css: string; tags: string[] }
}

export const useStyleManager = createWithEqualityFn<StyleManagerState>((set, get) => ({
  current: {},
  initial: {},
  styleSources: {},
  allStyles: new Map(),

  setInitialBatch: (selector, init) =>
    set(state => {
      const newStyleSources = { ...state.styleSources };
      if (!newStyleSources[selector]) {
        newStyleSources[selector] = {};
      }

      // 標記為已註冊
      Object.keys(init).forEach(prop => {
        newStyleSources[selector][prop] = 'registered';
      });

      const newAllStyles = new Map(state.allStyles);
      if (!newAllStyles.has(selector)) {
        newAllStyles.set(selector, new Map());
      }

      Object.entries(init).forEach(([prop, value]) => {
        newAllStyles.get(selector)!.set(prop, {
          value,
          source: 'registered',
          timestamp: Date.now()
        });
      });

      // merged baseline: old initial + new init（須攤平至 selector，勿用 { mergedInitial } 簡寫成巢狀 key）
      const mergedInitial = { ...(state.initial[selector] || {}), ...init } as StyleProps;

      return {
        initial: {
          ...state.initial,
          [selector]: mergedInitial,
        },
        current: {
          ...state.current,
          [selector]: mergedInitial,
        },
        styleSources: newStyleSources,
        allStyles: newAllStyles
      };
    }),

  setProp: (selector, prop, value) =>
    set(state => {
      const cur = state.current[selector] || {} as StyleProps;
      const ini = state.initial[selector] || {} as StyleProps;

      // Only set initial when the key truly doesn't exist
      const hasInitial = Object.prototype.hasOwnProperty.call(ini, prop);
      const nextIni = hasInitial ? ini : { ...ini, [prop]: value };

      const nextCurrent = { ...state.current, [selector]: { ...cur, [prop]: value } };

      // 更新 allStyles 追蹤
      const nextAllStyles = new Map(state.allStyles);
      if (!nextAllStyles.has(selector)) {
        nextAllStyles.set(selector, new Map());
      }

      // 更新 styleSources，手動調整的樣式標記為 manual
      const nextStyleSources = { ...state.styleSources };
      if (!nextStyleSources[selector]) {
        nextStyleSources[selector] = {};
      }
      // 手動調整的樣式優先級最高，標記為 manual
      nextStyleSources[selector][prop] = 'manual';

      nextAllStyles.get(selector)!.set(prop, {
        value,
        source: 'manual', // 手動調整的樣式標記為 manual
        timestamp: Date.now()
      });

      return {
        current: nextCurrent,
        initial: { ...state.initial, [selector]: nextIni },
        allStyles: nextAllStyles,
        styleSources: nextStyleSources
      };
    }),

  // 新增：CSS 導入功能
  importCSS: (cssRules) =>
    set(state => {
      const current = { ...state.current };
      const allStyles = new Map(state.allStyles);
      const styleSources = { ...state.styleSources };

      // 注入 CSS 規則到頁面
      if (typeof document !== 'undefined') {
        // 移除舊的導入樣式
        const existingStyle = document.getElementById('imported-css-styles');
        if (existingStyle) {
          existingStyle.remove();
        }

        // 創建新的樣式標籤
        const styleElement = document.createElement('style');
        styleElement.id = 'imported-css-styles';

        // 生成 CSS 規則
        const cssRulesText = cssRules.map(({ selector, properties }) => {
          const propertiesText = Object.entries(properties)
            .map(([prop, value]) => {
              const cssProp = prop.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());
              return `  ${cssProp}: ${value};`;
            })
            .join('\n');
          return `${selector} {\n${propertiesText}\n}`;
        }).join('\n\n');

        styleElement.textContent = cssRulesText;
        document.head.appendChild(styleElement);
      }

      cssRules.forEach(({ selector, properties }) => {
        if (!current[selector]) {
          current[selector] = {};
        }

        if (!styleSources[selector]) {
          styleSources[selector] = {};
        }

        // 更新 current 值
        Object.entries(properties).forEach(([prop, value]) => {
          // 修正類型問題：確保 prop 是 StyleKey 類型
          const styleKey = prop as keyof typeof current[typeof selector];
          if (current[selector]) {
            current[selector] = {
              ...current[selector],
              [styleKey]: value,
            };
          }

          // 標記為導入的樣式
          styleSources[selector][prop] = 'imported';

          // 追蹤到 allStyles
          if (!allStyles.has(selector)) {
            allStyles.set(selector, new Map());
          }
          allStyles.get(selector)!.set(prop, {
            value,
            source: 'imported',
            timestamp: Date.now()
          });

          // 自動設置 CSS 變數（高效覆蓋）
          // 處理複雜選擇器，創建有效的 CSS 變數名稱
          const cleanSelector = selector.replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
          const cssVarName = `--${cleanSelector}-${prop.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase())}`;
          if (typeof document !== 'undefined') {
            document.documentElement.style.setProperty(cssVarName, String(value));
          }
        });
      });

      return { current, allStyles, styleSources };
    }),

  // 新增：設置 CSS 變數（高效覆蓋樣式）
  setCSSVariable: (selector: string, prop: string, value: CssValue) =>
    set(state => {
      // 創建 CSS 變數名稱
      const cleanSelector = selector.replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
      const cssVarName = `--${cleanSelector}-${prop.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase())}`;

      // 設置 CSS 變數到 document.documentElement
      if (typeof document !== 'undefined') {
        document.documentElement.style.setProperty(cssVarName, String(value));
      }

      return state;
    }),

  // 新增：清除導入的 CSS 樣式
  clearImportedCSS: () =>
    set(state => {
      if (typeof document !== 'undefined') {
        const existingStyle = document.getElementById('imported-css-styles');
        if (existingStyle) {
          existingStyle.remove();
        }
      }

      // 清除導入的樣式狀態
      const current = { ...state.current };
      const allStyles = new Map(state.allStyles);
      const styleSources = { ...state.styleSources };

      // 移除所有 imported 樣式
      allStyles.forEach((props, selector) => {
        const newProps = new Map();
        props.forEach((entry, prop) => {
          if (entry.source !== 'imported') {
            newProps.set(prop, entry);
          }
        });
        if (newProps.size > 0) {
          allStyles.set(selector, newProps);
        } else {
          allStyles.delete(selector);
        }
      });

      // 清除 styleSources 中的 imported 標記
      Object.keys(styleSources).forEach(selector => {
        Object.keys(styleSources[selector]).forEach(prop => {
          if (styleSources[selector][prop] === 'imported') {
            delete styleSources[selector][prop];
          }
        });
        // 如果該選擇器沒有樣式了，移除整個選擇器
        if (Object.keys(styleSources[selector]).length === 0) {
          delete styleSources[selector];
        }
      });

      return { current, allStyles, styleSources };
    }),

  // 新增：清除導入並回復 initial
  resetImportedToInitial: () =>
    set(state => {
      if (typeof document !== 'undefined') {
        const existingStyle = document.getElementById('imported-css-styles');
        if (existingStyle) {
          existingStyle.remove();
        }
      }

      const current = { ...state.current };
      const allStyles = new Map(state.allStyles);
      const styleSources = { ...state.styleSources };

      // 移除所有 imported 樣式，並回復到 initial（若有）
      allStyles.forEach((props, selector) => {
        const newProps = new Map();
        props.forEach((entry, prop) => {
          if (entry.source !== 'imported') {
            newProps.set(prop, entry);
          } else if (current[selector]) {
            const initialValue = state.initial[selector]?.[prop as StyleKey];
            if (initialValue !== undefined) {
              current[selector] = {
                ...current[selector],
                [prop]: initialValue
              };
            } else {
              const nextSelector = { ...(current[selector] as StyleProps) } as Record<string, CssValue>;
              delete nextSelector[prop];
              current[selector] = nextSelector;
            }
          }
        });

        if (newProps.size > 0) {
          allStyles.set(selector, newProps);
        } else {
          allStyles.delete(selector);
        }
      });

      // 清除 styleSources 中的 imported 標記
      Object.keys(styleSources).forEach(selector => {
        Object.keys(styleSources[selector]).forEach(prop => {
          if (styleSources[selector][prop] === 'imported') {
            delete styleSources[selector][prop];
          }
        });
        if (Object.keys(styleSources[selector]).length === 0) {
          delete styleSources[selector];
        }
      });

      return { current, allStyles, styleSources };
    }),

  getProp: (selector, prop) => get().current[selector]?.[prop],
  getInitial: (selector, prop) => get().initial[selector]?.[prop],

  // 新增：獲取所有樣式（用於 export）
  getAllStyles: () => {
    const state = get();
    const cssOutput: string[] = [];
    const tags: string[] = [];

    // 按時間戳排序，確保覆蓋順序正確
    const sortedEntries: Array<{ selector: string; prop: string; entry: StyleEntry }> = [];

    state.allStyles.forEach((props, selector) => {
      props.forEach((entry, prop) => {
        sortedEntries.push({ selector, prop, entry });
      });
    });

    // 按時間戳排序（早的在前面，晚的在後面會覆蓋）
    sortedEntries.sort((a, b) => a.entry.timestamp - b.entry.timestamp);

    // 按選擇器分組，並處理覆蓋邏輯
    const selectorGroups = new Map<string, Map<string, StyleEntry>>();

    sortedEntries.forEach(({ selector, prop, entry }) => {
      // 過濾掉 registered 樣式，只保留 imported 和 manual
      if (entry.source === 'registered') {
        return;
      }

      if (!selectorGroups.has(selector)) {
        selectorGroups.set(selector, new Map());
      }

      // 後來的值會覆蓋之前的
      selectorGroups.get(selector)!.set(prop, entry);
    });

    const responseCountProps = selectorGroups.get(RESPONSE_COUNT_EXPORT_SELECTOR);
    const responseCountNewProps = selectorGroups.get(RESPONSE_COUNT_NEW_EXPORT_SELECTOR);
    const handledSelectors = new Set<string>();

    if (responseCountProps || responseCountNewProps) {
      const currentResponseCountProps = buildCurrentStyleEntries(
        state.current[RESPONSE_COUNT_EXPORT_SELECTOR],
        responseCountProps,
      );
      const resetBlock = formatCssBlock(
        RESPONSE_COUNT_EXPORT_SELECTOR,
        currentResponseCountProps,
        ["[RESPONSE_COUNT_RESET]"],
      );
      const commonBlock = formatCssBlock(RESPONSE_COUNT_EXPORT_SELECTOR, currentResponseCountProps);
      const newBlock = responseCountNewProps
        ? formatCssBlock(RESPONSE_COUNT_NEW_EXPORT_SELECTOR, responseCountNewProps)
        : null;

      if (resetBlock) cssOutput.push(resetBlock);
      if (commonBlock) cssOutput.push(commonBlock);
      if (newBlock) cssOutput.push(newBlock);

      handledSelectors.add(RESPONSE_COUNT_EXPORT_SELECTOR);
      handledSelectors.add(RESPONSE_COUNT_NEW_EXPORT_SELECTOR);
    }

    // 生成 CSS 和 tags
    selectorGroups.forEach((props, selector) => {
      if (handledSelectors.has(selector)) return;

      const block = formatCssBlock(selector, props);
      if (block) cssOutput.push(block);
    });

    // 生成說明 tags
    tags.push('/* ===== CSS EXPORT TAGS ===== */');
    tags.push('/* [MANUAL] - 用戶手動調整的樣式（最高優先級） */');
    tags.push('/* [IMPORTED] - 從外部 CSS 導入的樣式（中等優先級） */');
    tags.push('/* [RESPONSE_COUNT_RESET] - 回應數徽章匯出特例：先輸出 reset block 穩定 Plurk 實站覆蓋順序 */');
    tags.push('/* 注意：相同屬性的後續值會覆蓋前面的值 */');
    tags.push('/* ======================== */');

    return {
      css: cssOutput.join('\n\n'),
      tags: tags
    };
  },
}));

/** 小工具：只訂閱單一屬性的 hook（避免重渲染） */
export function useStyleProp(selector: string, prop: StyleKey) {
  const value = useStyleManager(
    s => s.current[selector]?.[prop],
    shallow
  );
  const initial = useStyleManager(s => s.initial[selector]?.[prop]);
  const setProp = useStyleManager(s => s.setProp);

  return {
    value,
    initial,
    set: (v: CssValue) => setProp(selector, prop, v),
  };
}

// 新增：CSS 導入的 hook
export function useCSSImporter() {
  const importCSS = useStyleManager(s => s.importCSS);
  const getAllStyles = useStyleManager(s => s.getAllStyles);
  const clearImportedCSS = useStyleManager(s => s.clearImportedCSS);
  const resetImportedToInitial = useStyleManager(s => s.resetImportedToInitial);

  return { importCSS, getAllStyles, clearImportedCSS, resetImportedToInitial };
}

