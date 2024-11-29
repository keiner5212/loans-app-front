export function formatUtcToLocal(utcDateStr: string, locale: string, timeZone: string): string {
    const localDate = new Date(utcDateStr);

    return localDate.toLocaleString(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: timeZone,
        timeZoneName: "short",
    });
}