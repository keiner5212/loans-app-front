import axiosInstance from "../axiosInstance";

export async function CreateUser(userData: any): Promise<any | undefined> {
    try {
        const response = await axiosInstance.post('/api/v1/user/', userData);
        return response.data
    } catch (error: any) {
        console.error('Error creando el usuario:', error.response?.data || error.message);
    }
}