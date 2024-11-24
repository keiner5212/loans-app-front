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