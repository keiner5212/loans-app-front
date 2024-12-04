import axiosInstance from "../axiosInstance";

export async function sendWhatsappNotification(to: string, message: string): Promise<any | undefined> {
    try {
        const response = await axiosInstance.post('/api/v1/notification/whatsapp/', {
            to: import.meta.env.VITE_WHATSAPP_COUNTRY_CODE + to,
            message
        });
        return response.data
    } catch (error: any) {
        console.error('Error guardando la firma:', error.response?.data || error.message);
    }
}

//email notifications

export async function sendEmailNotification(to: string, subject: string, message: string): Promise<any | undefined> {
    try {
        const response = await axiosInstance.post('/api/v1/notification/email/', {
            to,
            subject,
            text: message
        });
        return response.data
    } catch (error: any) {
        console.error('Error guardando la firma:', error.response?.data || error.message);
    }
}