
export enum CreditPeriod {
    // monthly
    MENSUAL = 12,
    // weekly
    SEMANAL = 52,
    // bi-weekly
    QUINCENAL = 26,
}

export const CreditPeriodObjectValues: { [key: string]: number } = {
    "MENSUAL": 12,
    "SEMANAL": 52,
    "QUINCENAL": 26
}

/**
 * function to convert monthly rate to another period
 * based on https://matefinanciera.com/conversion-de-tasas-de-interés (conversion de periodicidad)
 * @param rate the monthly rate in decimal format
 * @param period the period of the credit
 * @returns the converted rate
 */
export function convertMonthlyRate(rate: number, period: number): number {
    const annualRate = Math.pow(1 + rate, CreditPeriod.MENSUAL) - 1; // Convierte la tasa mensual a anual
    const convertedRate = Math.pow(1 + annualRate, 1 / period) - 1;  // Convierte la tasa anual al periodo deseado
    // Redondear hacia arriba a 4 decimales
    const roundedRate = Math.ceil(parseFloat((convertedRate * 10000).toFixed(1))) / 10000;

    return roundedRate;
}