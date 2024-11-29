import axiosInstance from "../axiosInstance";

export async function AproveCredit(creditId: number): Promise<any | undefined> {
    try {
        const response = await axiosInstance.put('/api/v1/credit/aprove/' + creditId);
        return response.data
    } catch (error: any) {
        console.error('Error aprobando el credito:', error.response?.data || error.message);
    }
}

export async function DeclineCredit(creditId: number): Promise<any | undefined> {
    try {
        const response = await axiosInstance.put('/api/v1/credit/decline/' + creditId);
        return response.data
    } catch (error: any) {
        console.error('Error declinando el credito:', error.response?.data || error.message);
    }
}