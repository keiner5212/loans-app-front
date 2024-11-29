import { AxiosError } from "axios";
import axiosInstance from "../axiosInstance";

export async function getConfig(key: string): Promise<any | undefined> {
    try {
        const res = await axiosInstance.get("/api/v1/config/" + key);
        return res.data
    } catch (error) {
        if (error instanceof AxiosError) return error.response
    }
}