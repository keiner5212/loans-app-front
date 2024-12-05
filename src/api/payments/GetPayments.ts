import axiosInstance from "../axiosInstance";

//get credits by user
export async function GetPaymentsOfCredit(creditId: string): Promise<any | undefined> {
    try {
        const response = await axiosInstance.get('/api/v1/payment/credit/' + creditId);
        return response.data
    } catch (error: any) {
        console.error('Error obteniendo las solicitudes:', error.response?.data || error.message);
    }
}