import axiosInstance from "../axiosInstance";

export async function SaveCreditContract(creditId: number, signedContract: string): Promise<any | undefined> {
    try {
        const response = await axiosInstance.put('/api/v1/credit/contract/' + creditId, {
            signedContract
        });
        return response.data
    } catch (error: any) {
        console.error('Error guardando la firma:', error.response?.data || error.message);
    }
}