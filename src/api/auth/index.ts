import axios, { AxiosError, AxiosResponse, HttpStatusCode } from "axios";
import { generateAppToken } from "../../utils/security/appToken";

export const login = async (email: string, password: string) => {
    try {
        const res = await axios.post(import.meta.env.VITE_BACKEND_URL + "/api/v1/user/signin", {
            email,
            password
        }, {
            headers: {
                "Content-Type": "application/json",
                "X-App-Token": generateAppToken()
            }
        })

        if (res.status === HttpStatusCode.Ok) {
            return res.data;
        }
    } catch (err) {
        console.log(err)
    }
};

export async function forgotPassword(email: string): Promise<AxiosResponse<any, any> | undefined> {
    try {
        const res = await axios.post(import.meta.env.VITE_BACKEND_URL + "/api/v1/user/forgot_password", { email }, {
            headers: {
                "Content-Type": "application/json",
                "X-App-Token": generateAppToken()
            }
        });
        return res
    } catch (error) {
        if (error instanceof AxiosError) return error.response
    }
}

export async function forgotPasswordCodeSend(email: string, code: number): Promise<AxiosResponse<any, any> | undefined> {
    try {
        const res = await axios.post(import.meta.env.VITE_BACKEND_URL + "/api/v1/user/forgot_password/verify_code", { email, code }, {
            headers: {
                "Content-Type": "application/json",
                "X-App-Token": generateAppToken()
            }
        });
        return res
    } catch (error) {
        if (error instanceof AxiosError) return error.response
    }
}

export async function forgotPasswordChangePassword(email: string, password: string, code: number): Promise<AxiosResponse<any, any> | undefined> {
    try {
        const res = await axios.post(import.meta.env.VITE_BACKEND_URL + "/api/v1/user/forgot_password/reset", { email, password, code }, {
            headers: {
                "Content-Type": "application/json",
                "X-App-Token": generateAppToken()
            }
        });
        return res
    } catch (error) {
        if (error instanceof AxiosError) return error.response
    }
}