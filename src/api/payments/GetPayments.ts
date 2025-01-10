import axiosInstance from "../axiosInstance";

//get credits by user
export async function GetPaymentsOfCredit(creditId: string): Promise<any | undefined> {
    try {
        const response = await axiosInstance.get('/api/v1/payment/credit/' + creditId, {
            headers: {
                'X-Disable-Cache': 'true'
            }
        });
        return response.data
    } catch (error: any) {
        console.error('Error obteniendo las solicitudes:', error.response?.data || error.message);
    }
}

//get payment by id
export async function GetPayment(id: number): Promise<any | undefined> {
    try {
        const response = await axiosInstance.get('/api/v1/payment/' + id, {
            headers: {
                'X-Disable-Cache': 'true'
            }
        });
        return response.data
    } catch (error: any) {
        console.error('Error obteniendo la solicitud:', error.response?.data || error.message);
    }
}