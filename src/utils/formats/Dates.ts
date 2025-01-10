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
