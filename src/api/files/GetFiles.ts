import axiosInstance from "../axiosInstance";

export async function getFile(filename: string): Promise<any | undefined> {
    try {
        const response = await axiosInstance.get('/api/v1/files/' + filename, { responseType: 'blob' });
        return response.data
    } catch (error: any) {
        console.error('Error obteniendo el archivo:', error.response?.data || error.message);
    }
}