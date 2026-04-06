"use client";
import { createWithEqualityFn } from "zustand/traditional";
import { createCoreSlice } from "./slices/coreSlice";
import { createExportSlice } from "./slices/exportSlice";
import { createImportSlice } from "./slices/importSlice";
import type { StyleManagerState } from "./types";

export const useStyleManager = createWithEqualityFn<StyleManagerState>((set, get) => ({
  ...(createCoreSlice(set, get) as any),
  ...(createImportSlice(set, get) as any),
  ...(createExportSlice(set, get) as any),
}));
