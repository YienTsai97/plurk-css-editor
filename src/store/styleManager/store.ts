"use client";
import { createWithEqualityFn } from "zustand/traditional";
import { createCoreSlice } from "./slices/coreSlice";
import { createExportSlice } from "./slices/exportSlice";
import { createImportSlice } from "./slices/importSlice";
import type { StyleManagerState } from "./types";

export const useStyleManager = createWithEqualityFn<StyleManagerState>((set, get) => ({
  ...createCoreSlice(set, get),
  ...createImportSlice(set, get),
  ...createExportSlice(set, get),
}) as StyleManagerState);
