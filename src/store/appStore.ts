//zustand store

import { create } from "zustand";

export interface UserInfo {
    id?: number;
    name?: string;
    email?: string;
    role?: string;
    document_type?: string;
    document?: string;
    phone?: string;
    created_at?: string;
}

export type AppStore = {
    authToken: string;
    setAuthToken: (token: string) => void;
    tokenReady: boolean;
    setTokenReady: (tokenReady: boolean) => void;
    userInfo: UserInfo;
    setUserInfo: (userInfo: UserInfo) => void
};

export const useAppStore = create<AppStore>((set) => ({
    authToken: "",
    setAuthToken: (token: string) => set((state) => ({ ...state, authToken: token })),
    tokenReady: false,
    setTokenReady: (tokenReady: boolean) => set((state) => ({ ...state, tokenReady })),
    userInfo: {} as UserInfo,
    setUserInfo: (userInfoPayload: UserInfo) => set((state) => {
        return {
            ...state,
            userInfo: {
                ...state.userInfo,
                ...userInfoPayload
            }
        }
    })
}));