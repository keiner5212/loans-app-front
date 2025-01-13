import { CreditPeriod } from "./Credits";

export function formatUtcToLocal(utcDateStr: string | undefined | null, locale: string, timeZone: string): string | undefined {
    if (!utcDateStr) return undefined;

    const localDate = new Date(utcDateStr);

    return localDate.toLocaleString(locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: timeZone,
        timeZoneName: "shortOffset",
    });
}

export function getDatePartsFormatted(date: Date): { day: string, month: string, year: string } {
    const day = date.getDate().toString().padStart(2, '0'); // Asegura que el día tenga dos dígitos
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Los meses en JavaScript son 0-indexados, por lo que se suma 1
    const year = date.getFullYear().toString(); // El año siempre tiene 4 dígitos

    return { day, month, year };
}


// Calcula el número de días entre dos fechas
export const calculateDaysBetween = (date1: Date, date2: Date): number => {
    const timeDifference = date2.getTime() - date1.getTime();
    return Math.floor(timeDifference / (1000 * 60 * 60 * 24));
};

// Calcula los días de retraso si actualDate es mayor que expectedDate, sino retorna 0
export const calculateDaysDelay = (expectedDate: Date, actualDate: Date): number => {
    if (actualDate > expectedDate) {
        return calculateDaysBetween(expectedDate, actualDate);
    }
    return 0; // No hay retraso si actualDate no es mayor que expectedDate
};

export function calculateNextPeriodDate(date: Date, period: CreditPeriod): Date {
    const nextDate = new Date(date); // Crear una nueva instancia para no modificar la original

    switch (period) {
        case CreditPeriod.MENSUAL:
            nextDate.setMonth(nextDate.getMonth() + 1); // Agregar un mes
            break;

        case CreditPeriod.SEMANAL:
            nextDate.setDate(nextDate.getDate() + 7); // Agregar 7 días
            break;

        case CreditPeriod.QUINCENAL:
            nextDate.setDate(nextDate.getDate() + 14); // Agregar 14 días
            break;

        default:
            throw new Error("Período no válido");
    }

    return nextDate;
}