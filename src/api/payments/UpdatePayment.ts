import axiosInstance from "../axiosInstance";

//get credits by user
export async function UpdatePaymentsOfCredit(creditId: string): Promise<any | undefined> {
    try {
        const response = await axiosInstance.put('/api/v1/payment/updateStatus/' + creditId);
        return response.data
    } catch (error: any) {
        console.error('Error en la solicitud:', error.response?.data || error.message || error);
    }
}