"use client";
import { CssValue, StyleKey } from "@/types/css.type";
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

type StyleDict = Record<string, Partial<Record<StyleKey, CssValue>>>

// 新增：樣式來源追蹤
type StyleSource = 'registered' | 'imported' | 'manual';

type StyleEntry = {
  value: CssValue;
  source: StyleSource;
  timestamp: number;
}

type StyleManagerState = {
  current: StyleDict,
  initial: StyleDict,
  // 新增：樣式來源追蹤
  styleSources: Record<string, Record<string, StyleSource>>,
  // 新增：所有樣式變化（包括未登錄的）
  allStyles: Map<string, Map<string, StyleEntry>>,

  //Initialize
  setInitialBatch: (selector: string, init: Partial<Record<StyleKey, CssValue>>) => void
  setProp: (selector: string, prop: StyleKey, value: CssValue) => void

  // 新增：CSS 導入功能
  importCSS: (cssRules: Array<{ selector: string; properties: Record<string, CssValue> }>) => void

  // 新增：設置 CSS 變數（高效覆蓋樣式）
  setCSSVariable: (selector: string, prop: string, value: CssValue) => void

  // 新增：清除導入的 CSS 樣式
  clearImportedCSS: () => void

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

      return {
        initial: {
          ...state.initial,
          [selector]: { ...(state.initial[selector] || {}), ...init }
        },
        current: {
          ...state.current,
          [selector]: { ...(state.initial[selector] || {}), ...init }
        },
        styleSources: newStyleSources,
        allStyles: newAllStyles
      };
    }),

  setProp: (selector, prop, value) =>
    set(state => {
      const cur = state.current[selector] || {};
      const ini = state.initial[selector] || {};

      // 如果沒有 initial，自動設置（方案一）
      if (!ini[prop]) {
        ini[prop] = value;
      }

      const current = { ...state.current, [selector]: { ...cur, [prop]: value } };

      // 更新 allStyles 追蹤
      const allStyles = new Map(state.allStyles);
      if (!allStyles.has(selector)) {
        allStyles.set(selector, new Map());
      }

      // 更新 styleSources，手動調整的樣式標記為 manual
      const styleSources = { ...state.styleSources };
      if (!styleSources[selector]) {
        styleSources[selector] = {};
      }
      // 手動調整的樣式優先級最高，標記為 manual
      styleSources[selector][prop] = 'manual';

      allStyles.get(selector)!.set(prop, {
        value,
        source: 'manual', // 手動調整的樣式標記為 manual
        timestamp: Date.now()
      });

      return {
        current,
        initial: { ...state.initial, [selector]: { ...ini } },
        allStyles,
        styleSources
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
            (current[selector] as any)[styleKey] = value;
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

    // 生成 CSS 和 tags
    selectorGroups.forEach((props, selector) => {
      const lines: string[] = [];
      const propTags: string[] = [];

      // 按屬性名稱排序，確保輸出一致
      const sortedProps = Array.from(props.entries()).sort((a, b) => a[0].localeCompare(b[0]));

      sortedProps.forEach(([prop, entry]) => {
        const cssProp = prop.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());
        lines.push(`  ${cssProp}: ${entry.value};`);

        // 只添加 IMPORTED 和 MANUAL 標記，不顯示 REGISTERED
        if (entry.source === 'imported') {
          propTags.push(`[IMPORTED] ${prop}`);
        } else if (entry.source === 'manual') {
          propTags.push(`[MANUAL] ${prop}`);
        }
        // 移除 REGISTERED 標記的顯示
      });

      if (lines.length > 0) {
        // 合併 tag 註釋到一行
        if (propTags.length > 0) {
          cssOutput.push(`/* ${propTags.join(' ')} */\n${selector} {\n${lines.join('\n')}\n}`);
        } else {
          cssOutput.push(`${selector} {\n${lines.join('\n')}\n}`);
        }
      }
    });

    // 生成說明 tags
    tags.push('/* ===== CSS EXPORT TAGS ===== */');
    tags.push('/* [MANUAL] - 用戶手動調整的樣式（最高優先級） */');
    tags.push('/* [IMPORTED] - 從外部 CSS 導入的樣式（中等優先級） */');
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

  return { importCSS, getAllStyles, clearImportedCSS };
}

