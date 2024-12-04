import axiosInstance from "../axiosInstance";

export async function GetCredits(): Promise<any | undefined> {
    try {
        const response = await axiosInstance.get('/api/v1/credit/');
        return response.data
    } catch (error: any) {
        console.error('Error obteniendo las solicitudes:', error.response?.data || error.message);
    }
}

export async function GetCredit(id: number): Promise<any | undefined> {
    try {
        const response = await axiosInstance.get('/api/v1/credit/' + id);
        return response.data
    } catch (error: any) {
        console.error('Error obteniendo la solicitud:', error.response?.data || error.message);
    }
}