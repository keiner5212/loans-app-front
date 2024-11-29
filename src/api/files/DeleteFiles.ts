import axiosInstance from "../axiosInstance";

export async function deleteFile(filename: string): Promise<any | undefined> {
    try {
        const response = await axiosInstance.delete('/api/v1/files/' + filename);
        return response.data
    } catch (error: any) {
        console.error('Error al eliminar el archivo:', error.response?.data || error.message);
    }
}