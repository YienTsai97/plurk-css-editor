import { CssValue, StyleKey } from "@/types/css.type";
import { StoreApi } from "zustand";

export type StyleProps = Partial<Record<StyleKey, CssValue>>;
export type StyleDict = Record<string, StyleProps>;

export type StyleSource = "registered" | "imported" | "manual";

export type StyleEntry = {
  value: CssValue;
  source: StyleSource;
  timestamp: number;
};

export type CSSRule = { selector: string; properties: Record<string, CssValue> };

export type StyleManagerState = {
  current: StyleDict;
  initial: StyleDict;
  styleSources: Record<string, Record<string, StyleSource>>;
  allStyles: Map<string, Map<string, StyleEntry>>;

  resetAll: () => void;
  setInitialBatch: (selector: string, init: StyleProps) => void;
  setProp: (selector: string, prop: StyleKey, value: CssValue) => void;

  importCSS: (cssRules: CSSRule[]) => void;
  replaceImportedCSS: (cssRules: CSSRule[]) => void;
  setCSSVariable: (selector: string, prop: string, value: CssValue) => void;
  clearImportedCSS: () => void;
  resetImportedToInitial: () => void;
  resetAllToInitial: () => void;

  getProp: (selector: string, prop: StyleKey) => CssValue | undefined;
  getInitial: (selector: string, prop: StyleKey) => CssValue | undefined;

  getAllStyles: () => { css: string; tags: string[] };
};

export type SliceSet = StoreApi<StyleManagerState>["setState"];
export type SliceGet = StoreApi<StyleManagerState>["getState"];
