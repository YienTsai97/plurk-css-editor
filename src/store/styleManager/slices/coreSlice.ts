import { CssValue, StyleKey } from "@/types/css.type";
import { SliceGet, SliceSet, StyleManagerState, StyleProps } from "../types";

export const createCoreSlice = (set: SliceSet, get: SliceGet): Partial<StyleManagerState> => ({
  current: {},
  initial: {},
  styleSources: {},
  allStyles: new Map(),

  resetAll: () =>
    set(() => ({
      current: {},
      initial: {},
      styleSources: {},
      allStyles: new Map(),
    })),

  setInitialBatch: (selector: string, init: StyleProps) =>
    set((state: StyleManagerState) => {
      const merged = { ...(state.initial[selector] ?? {}), ...init } as StyleProps;
      // 用途：保留已有 current（draft import／上傳）；只補尚未出現的預設 key。
      const mergedCurrent = {
        ...merged,
        ...(state.current[selector] ?? {}),
      } as StyleProps;

      const nextStyleSources = { ...state.styleSources };
      nextStyleSources[selector] = { ...(nextStyleSources[selector] ?? {}) };
      Object.keys(init).forEach((prop) => {
        const existing = nextStyleSources[selector][prop];
        if (existing === "imported" || existing === "manual") return;
        nextStyleSources[selector][prop] = "registered";
      });

      const nextAllStyles = new Map(state.allStyles);
      if (!nextAllStyles.has(selector)) nextAllStyles.set(selector, new Map());
      const m = nextAllStyles.get(selector)!;
      const now = Date.now();
      Object.entries(init).forEach(([prop, value]) => {
        const existing = m.get(prop);
        if (existing && (existing.source === "imported" || existing.source === "manual")) {
          return;
        }
        m.set(prop, { value, source: "registered", timestamp: now });
      });

      return {
        initial: { ...state.initial, [selector]: merged },
        current: { ...state.current, [selector]: mergedCurrent },
        styleSources: nextStyleSources,
        allStyles: nextAllStyles,
      };
    }),

  setProp: (selector: string, prop: StyleKey, value: CssValue) =>
    set((state: StyleManagerState) => {
      const cur = (state.current[selector] ?? {}) as StyleProps;
      const ini = (state.initial[selector] ?? {}) as StyleProps;

      const hasInitial = Object.prototype.hasOwnProperty.call(ini, prop);
      const nextIni = hasInitial ? ini : { ...ini, [prop]: value };

      const nextCurrent = {
        ...state.current,
        [selector]: { ...cur, [prop]: value },
      };

      const nextStyleSources = { ...state.styleSources };
      nextStyleSources[selector] = { ...(nextStyleSources[selector] ?? {}), [prop]: "manual" };

      const nextAllStyles = new Map(state.allStyles);
      if (!nextAllStyles.has(selector)) nextAllStyles.set(selector, new Map());
      nextAllStyles.get(selector)!.set(prop, { value, source: "manual", timestamp: Date.now() });

      return {
        current: nextCurrent,
        initial: { ...state.initial, [selector]: nextIni },
        styleSources: nextStyleSources,
        allStyles: nextAllStyles,
      };
    }),

  getProp: (selector: string, prop: StyleKey) => get().current[selector]?.[prop],
  getInitial: (selector: string, prop: StyleKey) => get().initial[selector]?.[prop],
});
