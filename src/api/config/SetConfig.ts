import { AxiosError } from "axios";
import axiosInstance from "../axiosInstance";

export async function setConfig(key: string, value: string): Promise<any | undefined> {
    try {
        const res = await axiosInstance.put("/api/v1/config/", { key, value });
        return res.data
    } catch (error) {
        if (error instanceof AxiosError) return error.response
    }
}