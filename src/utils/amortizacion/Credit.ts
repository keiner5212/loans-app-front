import { convertMonthlyRate } from "../formats/Credits";

export interface AmortizationRow {
    periodo: number;
    pago: number;
    intereses: number;
    amortizacion: number;
    deudaRestante: number;
}

//funcion para calcular el pago que debe hacer el usuario en cada periodo (sin crear toda la tabla)
export const calcularPago = (tasaInteres: number, deuda: number, pagoInicial: number, periodos: number, CreditPeriod: number) => {
    const tasaPeriodo = convertMonthlyRate(tasaInteres, CreditPeriod); // Convertir tasa mensual a especifica
    const deudaRestante = deuda - pagoInicial; // Deuda luego del pago inicial
    const pagoPeriodo = (deudaRestante * tasaPeriodo * Math.pow(1 + tasaPeriodo, periodos)) / (Math.pow(1 + tasaPeriodo, periodos) - 1); // Calcular pago mensual
    // Redondear hacia arriba a 4 decimales
    const rounded = Math.ceil(parseFloat((pagoPeriodo * 10000).toFixed(1))) / 10000;
    return rounded;
}

export const calcularTabla = (tasaInteres: number, deuda: number, pagoInicial: number, periodos: number, CreditPeriod: number) => {
    const tasaPeriodo = convertMonthlyRate(tasaInteres, CreditPeriod); // Convertir tasa mensual a específica
    const deudaRestante = deuda - pagoInicial; // Deuda después del pago inicial
    const pagoPeriodo = (deudaRestante * tasaPeriodo * Math.pow(1 + tasaPeriodo, periodos)) / (Math.pow(1 + tasaPeriodo, periodos) - 1); // Calcular pago mensual

    let deudaActual = deudaRestante;
    let tabla: AmortizationRow[] = [];
    let totalPagado = 0; // Inicializamos con el pago inicial
    let totalIntereses = 0;
    let totalAmortizado = 0;

    // Añadir el periodo 0 con la deuda inicial
    tabla.push({
        periodo: 0,
        pago: 0,
        intereses: 0,
        amortizacion: 0,
        deudaRestante: deudaActual,
    });

    // Calcular los siguientes periodos
    for (let i = 1; i <= periodos; i++) {
        const intereses = deudaActual * tasaPeriodo;
        const amortizacion = pagoPeriodo - intereses;
        deudaActual -= amortizacion;

        // Asegurarnos de que la deuda no sea negativa
        deudaActual = Math.max(deudaActual, 0);
        //asegurar que la deuda no sea absurdamente pequeña por errores en resta
        if(deudaActual < 1e-8) deudaActual = 0

        tabla.push({
            periodo: i,
            pago: pagoPeriodo,
            intereses: intereses,
            amortizacion: amortizacion,
            deudaRestante: deudaActual > 0 ? deudaActual : 0,
        });

        // Acumulamos los totales
        totalPagado += pagoPeriodo;
        totalIntereses += intereses;
        totalAmortizado += amortizacion;
    }

    return { tabla, totalPagado, totalIntereses, totalAmortizado };
};
