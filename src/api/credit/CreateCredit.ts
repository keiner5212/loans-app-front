import axiosInstance from "../axiosInstance";

export async function CreateCredit(creditData: any): Promise<any | undefined> {
    try {
        const response = await axiosInstance.post('/api/v1/credit/', creditData);
        return response.data
    } catch (error: any) {
        console.error('Error creando el usuario:', error.response?.data || error.message);
    }
}

export async function CreateFinancing(financingData: any): Promise<any | undefined> {
    try {
        const response = await axiosInstance.post('/api/v1/financing/', financingData);
        return response.data
    } catch (error: any) {
        console.error('Error creando el usuario:', error.response?.data || error.message);
    }
}