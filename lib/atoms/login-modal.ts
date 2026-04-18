import { atom } from "jotai";

export type LoginModalState = {
  open: boolean;
  callbackUrl: string;
};

export const loginModalAtom = atom<LoginModalState>({
  open: false,
  callbackUrl: "/feed",
});
