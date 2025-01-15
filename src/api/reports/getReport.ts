import axiosInstance from "../axiosInstance";

export async function getReport(table: string, startDate: Date | undefined, endDate: Date | undefined, data: any) {
    try {
        const response = await axiosInstance.post('/api/v1/report/' + table, { startDate, endDate, data });
        return response.data
    } catch (error: any) {
        console.error('Error obteniendo el reporte:', error.response?.data || error.message);
    }
}