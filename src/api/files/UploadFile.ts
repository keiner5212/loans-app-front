import axiosInstance from "../axiosInstance";

export async function uploadFile(file: File): Promise<any | undefined> {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await axiosInstance.post('/api/v1/files/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data
    } catch (error: any) {
        console.error('Error subiendo el archivo:', error.response?.data || error.message);
    }
}

