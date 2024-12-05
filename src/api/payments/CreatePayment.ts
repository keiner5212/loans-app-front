import axiosInstance from "../axiosInstance";

export async function CreatePayment(PaymentData: any): Promise<any | undefined> {
    try {
        const response = await axiosInstance.post('/api/v1/payment/', PaymentData);
        return response.data
    } catch (error: any) {
        console.error('Error creando el pago:', error.response?.data || error.message);
    }
}
