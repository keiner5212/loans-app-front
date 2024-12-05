
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



export function convertMonthlyRate(rate: number, period: number): number {
    const annualRate = Math.pow(1 + rate, CreditPeriod.MENSUAL) - 1; // Convierte la tasa mensual a anual
    const convertedRate = Math.pow(1 + annualRate, 1 / period) - 1;  // Convierte la tasa anual al periodo deseado

    // Redondear hacia arriba al segundo decimal
    const roundedRate = Math.round(convertedRate * 10000) / 10000;

    return roundedRate;
}