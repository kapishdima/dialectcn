import { atom } from "jotai";

export type CurrentPreset = {
  code: string;
  presetId: string;
  prev: string | null;
  next: string | null;
};

export const currentPresetAtom = atom<CurrentPreset | null>(null);