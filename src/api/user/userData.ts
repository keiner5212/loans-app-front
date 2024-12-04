import { AxiosError, AxiosResponse } from "axios";
import axiosInstance from "../axiosInstance";

export async function getSelfUserInfo(): Promise<AxiosResponse<any, any> | undefined> {
    try {
        const res = await axiosInstance.get("/api/v1/user/");
        return res
    } catch (error) {
        if (error instanceof AxiosError) return error.response
    }
}

export async function getUsers() {
    try {
        const res = await axiosInstance.get("/api/v1/user/all");
        return res.data
    } catch (error) {
        if (error instanceof AxiosError) return error.response
    }
}

export async function getUserById(id: number) {
    try {
        const res = await axiosInstance.get(`/api/v1/user/${id}`);
        return res.data
    } catch (error) {
        if (error instanceof AxiosError) return error.response
    }
}