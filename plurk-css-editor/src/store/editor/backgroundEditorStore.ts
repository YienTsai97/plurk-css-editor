import { create } from "zustand";

export type BackgroundTarget =
  | "wallpaper"
  | "id_creature"
//add more target here

type BackgroundEditorState = {
  //backgrounds is a record of background targets and their urls
  backgrounds: Record<BackgroundTarget, string | null>;
  //set specific background
  setBackground: (target: BackgroundTarget, url: string) => void;
  //clear specific background
  clearBackground: (target: BackgroundTarget) => void;
}


export const useBackgroundEditorStore = create<BackgroundEditorState>((set) => ({
  backgrounds: {
    wallpaper: null,
    id_creature: null,
  },

  setBackground: (target: BackgroundTarget, url: string) =>
    set((state) => ({
      backgrounds: {
        ...state.backgrounds,
        [target]: url,
      },
    })),

  clearBackground: (target: BackgroundTarget) =>
    set((state) => ({
      backgrounds: {
        ...state.backgrounds,
        [target]: null,
      },
    })),





}))