"use client";
import { CssValue, StyleKey } from "@/types/css.type";
import { shallow } from "zustand/shallow";
import { useStyleManager } from "./store";

export { useStyleManager };

export function useStyleProp(selector: string, prop: StyleKey) {
  const value = useStyleManager((s) => s.current[selector]?.[prop], shallow);
  const initial = useStyleManager((s) => s.initial[selector]?.[prop]);
  const setProp = useStyleManager((s) => s.setProp);

  return { value, initial, set: (v: CssValue) => setProp(selector, prop, v) };
}

export function useCSSImporter() {
  const importCSS = useStyleManager((s) => s.importCSS);
  const getAllStyles = useStyleManager((s) => s.getAllStyles);
  const clearImportedCSS = useStyleManager((s) => s.clearImportedCSS);
  const resetImportedToInitial = useStyleManager((s) => s.resetImportedToInitial);

  return { importCSS, getAllStyles, clearImportedCSS, resetImportedToInitial };
}
