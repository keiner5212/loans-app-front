//zustand store

import { create } from "zustand";

export type AppStore = {
    authToken: string;
    setAuthToken: (token: string) => void;
};

export const useAppStore = create<AppStore>((set) => ({
    authToken: "",
    setAuthToken: (token: string) => set((state) => ({ ...state, authToken: token })),
}));