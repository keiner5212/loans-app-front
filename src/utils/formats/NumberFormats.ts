export function numeroATexto(num: number): string {
    if (num === 0) return 'cero';
    if (num < 0) return `menos ${numeroATexto(Math.abs(num))}`;

    const sufijos: string[] = ['', 'mil', 'millón', 'mil millones', 'billón'];
    const partes: string[] = [];
    let i = 0;

    while (num > 0) {
        const fragmento = num % 1000;
        if (fragmento > 0) {
            let texto = convertirMenosDeMil(fragmento);
            if (i === 1 && fragmento === 1) {
                texto = 'mil';
            } else if (i > 0) {
                if (fragmento === 1) {
                    texto = `un ${sufijos[i]}`;
                } else {
                    texto += ` ${sufijos[i]}${i >= 2 ? 'es' : ''}`;
                }
            }
            partes.unshift(texto);
        }
        num = Math.floor(num / 1000);
        i++;
    }

    return partes.join(' ').trim();
}

function convertirMenosDeMil(num: number): string {
    const unidades: string[] = ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
    const decenas: string[] = ['', 'diez', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
    const especiales: string[] = ['diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve'];
    const centenas: string[] = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];

    if (num === 100) return 'cien';
    if (num < 10) return unidades[num];
    if (num < 20) return especiales[num - 10];
    if (num < 30) return num === 20 ? 'veinte' : `veinti${unidades[num - 20]}`;
    if (num < 100) {
        const decena = Math.floor(num / 10);
        const unidad = num % 10;
        return unidad === 0 ? decenas[decena] : `${decenas[decena]} y ${unidades[unidad]}`;
    }
    if (num < 1000) {
        const centena = Math.floor(num / 100);
        const resto = num % 100;
        return resto === 0 ? centenas[centena] : `${centenas[centena]} ${convertirMenosDeMil(resto)}`;
    }

    return '';
}

export function formatToCurrency(value: number): string {
    return value.toLocaleString('en-US');
}