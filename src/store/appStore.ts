//zustand store

import { create } from "zustand";

export type AppStore = {
    authToken: string;
    setAuthToken: (token: string) => void;
    tokenReady: boolean;
    setTokenReady: (tokenReady: boolean) => void;
};

export const useAppStore = create<AppStore>((set) => ({
    authToken: "",
    setAuthToken: (token: string) => set((state) => ({ ...state, authToken: token })),
    tokenReady: false,
    setTokenReady: (tokenReady: boolean) => set((state) => ({ ...state, tokenReady }))
}));