import axiosInstance from "../axiosInstance";


export async function DeleteUser(id: number): Promise<any | undefined> {
    try {
        const response = await axiosInstance.delete('/api/v1/user/' + id);
        return response.data
    } catch (error: any) {
        console.error('Error obteniendo la solicitud:', error.response?.data || error.message);
    }
}