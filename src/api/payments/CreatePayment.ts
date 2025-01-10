import axiosInstance from "../axiosInstance";

export async function CreatePayment(payment_id: number, employee_id: number, late_amount: number): Promise<any | undefined> {
    try {
        const response = await axiosInstance.post('/api/v1/payment/', {
            payment_id, employee_id, late_amount
        });
        return response.data
    } catch (error: any) {
        console.error('Error creando el pago:', error.response?.data || error.message);
    }
}
