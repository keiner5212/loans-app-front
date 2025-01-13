import { Document, Page, StyleSheet, Text, View, Image, Font } from "@react-pdf/renderer";
import { FunctionComponent } from "react";
import arialNarrowFont from "@/assets/fonts/arial-narrow-7-font/arial-narrow.ttf"
import arialNarrow7BoldFont from "@/assets/fonts/arial-narrow-7-font/ArialNarrow7-9YJ9n.ttf"
import { calculateNextPeriodDate, formatUtcToLocal, getDatePartsFormatted } from "@/utils/formats/Dates";
import { CreditType } from "@/constants/credits/Credit";
import { formatToCurrency, numeroATexto } from "@/utils/formats/NumberFormats";
import { CreditPeriod } from "@/utils/formats/Credits";

Font.register({
    family: 'ArialNarrow',
    src: arialNarrowFont
});

Font.register({
    family: 'ArialNarrowBold',
    src: arialNarrow7BoldFont
})


const styles = StyleSheet.create({
    page: {
        padding: 20,
        fontSize: 12,
        fontFamily: 'ArialNarrow',
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    logo: {
        width: 100,
        height: 50,
        borderRadius: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        backgroundColor: "black",
        color: "white",
        textAlign: "center",
        padding: 5,
        borderRadius: 5,
    },
    section: {
        marginBottom: 12,
    },
    table: {
        display: "flex",
        flexDirection: "column",
        marginBottom: 10,
    },
    row: {
        flexDirection: "row",
    },
    cell: {
        flex: 1,
        padding: 5,
        borderWidth: 1,
        borderColor: "black",
    },
    cellLast: {
        flex: 1,
        padding: 5,
        borderWidth: 1,
        borderColor: "black",
    },
    bold: {
        fontWeight: "bold",
        fontFamily: 'ArialNarrowBold',
    },
    signatureBlock: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 40,
        gap: 10,
    },
    signature: {
        flex: 1,
        textAlign: "center",
    },
    signatureLine: {
        borderTopWidth: 1,
        marginTop: 70,
        marginBottom: 5,
    },
    signatureLineNoSpace: {
        borderTopWidth: 1,
        marginBottom: 5,
    },
    managerSignature: {
        height: 70,
    },
    textVertical: {
        display: "flex",
        gap: 5,
        flexDirection: "column",
    }
});

interface ContratoProps {
    signatureUrl: string;
    CompanyLogoURL: string
    ContractDate: Date;
    CompanyName: string;
    CompanyAddress: string;
    CompanyPhone: string;
    CompanyEmail: string;
    CompanyRegistration: string;
    creditType: CreditType;
    clientName: string;
    clientDocument: string;
    FinancingVehicle: string;
    creditAmount: number;
    downPayment: number;
    creditPeriod: number;
    creditPaumentAmount: number;
    creditYears: number
}

const Contrato: FunctionComponent<ContratoProps> = ({ signatureUrl, CompanyLogoURL, ContractDate, CompanyName,
    CompanyAddress, creditType, clientDocument, clientName, FinancingVehicle, creditAmount, downPayment,
    CompanyPhone, creditPeriod, creditPaumentAmount, creditYears,
    CompanyEmail,
    CompanyRegistration, }) => {

    const { day, month, year } = getDatePartsFormatted(ContractDate)
    const Vendedor = () => {
        if (creditType == CreditType.FINANCING) {
            return <Text style={styles.bold}>EL VENDEDOR</Text>
        }
        return <Text style={styles.bold}>EL ACREEDOR</Text>
    }
    const Comprador = () => {
        if (creditType == CreditType.FINANCING) {
            return <Text style={styles.bold}>EL COMPRADOR</Text>
        }
        return <Text style={styles.bold}>EL DEUDOR</Text>
    }
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Image src={CompanyLogoURL} style={styles.logo} />
                    <Text style={styles.title}>CONTRATO PRIVADO DE {creditType == CreditType.FINANCING ? "COMPRAVENTA A PLAZOS DE MOTOCICLETA(S)" : "PRÉSTAMO O CRÉDITO"}</Text>
                </View>

                {/* Company and Payment Info */}
                <View style={styles.section}>
                    <View style={styles.table}>
                        <View style={styles.row}>
                            <Text style={styles.cell}><Text style={styles.bold}>Empresa:</Text> {CompanyName}</Text>
                            <Text style={styles.cell}><Text style={styles.bold}>RTN:</Text> {CompanyRegistration}</Text>
                            <Text style={styles.cell}><Text style={styles.bold}>Dia:</Text> {day}</Text>
                            <Text style={styles.cell}><Text style={styles.bold}>Mes:</Text> {month}</Text>
                            <Text style={styles.cellLast}><Text style={styles.bold}>Año:</Text> {year}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.cell}><Text style={styles.bold}>Dirección:</Text> {CompanyAddress}</Text>
                            <Text style={styles.cell}><Text style={styles.bold}>Correo:</Text> {CompanyEmail}</Text>
                            <Text style={styles.cellLast}><Text style={styles.bold}>Teléfono:</Text> {CompanyPhone}</Text>
                        </View>
                    </View>
                </View>

                {/* content */}

                <View style={styles.section}>
                    <Text style={styles.bold}>
                        Conste, por medio del presente documento al tenor de las siguientes cláusulas:
                    </Text>
                </View>


                <View style={styles.section}>
                    <View style={styles.textVertical}>
                        <Text style={styles.bold}>
                            CLÁUSULA PRIMERA: PARTES INTERVINIENTES:
                        </Text>
                        <Text>
                            <Text style={styles.bold}>a)</Text> Yo <Text style={styles.bold}>{CompanyName}</Text>, con residencia en <Text style={styles.bold}>{CompanyAddress}</Text>,
                            con Número de RTN <Text style={styles.bold}>{CompanyRegistration}</Text>, en mi condición como empresa, quien en adelante y para
                            los efectos de este contrato se le podrá denominar como <Vendedor />.
                        </Text>
                        <Text>
                            <Text style={styles.bold}>b)</Text> Yo <Text style={styles.bold}>{clientName}</Text> Mayor de edad, hondureño con domicilio en esta ciudad, y
                            con tarjeta de identidad Número <Text style={styles.bold}>{clientDocument}</Text>, quien en adelante y para
                            los efectos de este contrato se le podrá denominar como <Comprador />.
                        </Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <View style={styles.textVertical}>
                        <Text style={styles.bold}>
                            CLAUSULA SEGUNDA, ANTECEDENTE:
                        </Text>
                        <Text>
                            <Text style={styles.bold}>a)</Text> <Vendedor />, {creditType == CreditType.FINANCING ?
                                <>
                                    es propietario del vehiculo con VIN <Text style={styles.bold}>{FinancingVehicle}</Text> y
                                </>
                                :
                                <>
                                    manifiesta estar en capacidad de otorgar un crédito a <Comprador />, bajo los términos y condiciones establecidos en este contrato.
                                </>
                            }
                        </Text>
                        <Text>
                            <Text style={styles.bold}>b)</Text> <Comprador />, {creditType == CreditType.FINANCING ?
                                <>
                                    ha manifestado a <Vendedor /> en forma voluntaria, su deseo de adquirir el vehiculo antes descrito.
                                </>
                                :
                                <>
                                    ha manifestado a <Vendedor /> en forma voluntaria, su interés de recibir un crédito para los fines
                                    que estime convenientes, comprometiéndose al cumplimiento de las condiciones pactadas en este contrato.
                                </>
                            }
                        </Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <View style={styles.textVertical}>
                        <Text style={styles.bold}>
                            {creditType == CreditType.FINANCING ?
                                <>
                                    CLAUSULA TERCERA COMPRAVENTA CON RESERVA DE DOMINIO:
                                </>
                                :
                                <>
                                    CLÁUSULA TERCERA: CRÉDITO CON RESERVA DE DOMINIO
                                </>
                            }
                        </Text>
                        <Text>
                            {creditType == CreditType.FINANCING ?
                                <>
                                    Con los antecedentes expuestos <Vendedor />, da en venta el vehículo
                                    detallado en clausula precedente, reservándose para si el domino del mismo,
                                    mientras que <Comprador />, acepta la presente compraventa por así convenir a sus
                                    intereses. En consecuencia, se perfeccionará esta venta <Comprador />, pasará a ser
                                    propietario del vehículo cuando haya pagado íntegramente su precio.
                                </>
                                :
                                <>
                                    Con los antecedentes expuestos, <Vendedor /> otorga un préstamo de dinero a <Comprador />,
                                    quien acepta las condiciones de este préstamo y se compromete a cumplir con la totalidad
                                    de los pagos estipulados, incluyendo intereses y demás cargos establecidos en este contrato.
                                </>
                            }
                        </Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <View style={styles.textVertical}>
                        <Text style={styles.bold}>
                            CLAUSULA CUARTA: CONDICIONES GENERALES, PRECIO, FORMA DE PAGO:
                        </Text>
                        <Text>
                            <Comprador />, se compromete a pagar a <Vendedor />, los siguientes valores:
                        </Text>
                        <Text>
                            <Text style={styles.bold}>a)</Text> {creditType == CreditType.FINANCING ? (
                                <>
                                    El valor total a financiar el vehículo que asciende a la suma de <Text style={styles.bold}>{numeroATexto(creditAmount)}
                                        LEMPIRAS (L. {formatToCurrency(creditAmount)})</Text>, pagaderos en la forma siguiente:
                                    {downPayment > 0 && (
                                        <>
                                            <Text style={styles.bold}>{numeroATexto(downPayment)} LEMPIRAS (L. {formatToCurrency(downPayment)}) EN
                                                CONCEPTO DE PRIMA</Text> el valor restante
                                        </>
                                    )}
                                    <Text style={styles.bold}>L. {formatToCurrency(creditAmount - downPayment)}, en pagos a plazo de
                                        {numeroATexto(creditYears * 12)} MESES
                                        ({creditYears * 12}), con un total de {numeroATexto(creditYears * creditPeriod)} cuotas niveladas de manera
                                        {creditPeriod == CreditPeriod.MENSUAL
                                            ? " mensual"
                                            : creditPeriod == CreditPeriod.SEMANAL
                                                ? " semanal"
                                                : " quincenal"} con una cuota de L. {formatToCurrency(creditPaumentAmount)}</Text>, que se detallan
                                    en el cuadro <Text style={styles.bold}>Anexo 1</Text>. La primera cuota deberá cancelarse el
                                    {formatUtcToLocal(
                                        calculateNextPeriodDate(new Date(), creditPeriod).toUTCString(),
                                        import.meta.env.VITE_LOCALE,
                                        import.meta.env.VITE_TIMEZONE
                                    )}, y así sucesivamente hasta la completa cancelación total del capital, intereses, costos y gastos, mediante un
                                    crédito que en esta misma fecha
                                    <Comprador />, ha contratado con {CompanyName}. Tanto <Vendedor /> como <Comprador /> se comprometen a ceder todos
                                    los derechos y cumplir con todas las obligaciones que emanen del presente contrato.
                                </>
                            ) : (
                                <>
                                    El crédito otorgado asciende a la suma de <Text style={styles.bold}>{numeroATexto(creditAmount)} LEMPIRAS (L. {formatToCurrency(creditAmount)}),
                                        el cual será pagado en
                                        cuotas niveladas {creditPeriod == CreditPeriod.MENSUAL
                                            ? "mensuales"
                                            : creditPeriod == CreditPeriod.SEMANAL
                                                ? "semanales"
                                                : "quincenales"} durante un plazo de {numeroATexto(creditYears * 12)} MESES ({creditYears * 12}),
                                        con una cuota de L. {formatToCurrency(creditPaumentAmount)}</Text>, que se detallan
                                    en el cuadro <Text style={styles.bold}>Anexo 1</Text>. La primera cuota deberá ser cancelada el
                                    {formatUtcToLocal(
                                        calculateNextPeriodDate(new Date(), creditPeriod).toUTCString(),
                                        import.meta.env.VITE_LOCALE,
                                        import.meta.env.VITE_TIMEZONE
                                    )}, y así sucesivamente hasta completar la totalidad de los pagos, incluyendo el capital, intereses, costos
                                    y gastos relacionados. <Comprador /> y <Vendedor /> acuerdan cumplir con todas las obligaciones derivadas
                                    del presente contrato y ceder los derechos correspondientes a {CompanyName}.
                                </>
                            )}

                        </Text>
                        <Text>
                            <Text style={styles.bold}>b)</Text>
                        </Text>
                    </View>
                </View>

                {/* 
                <View style={styles.section}>
                    <View style={styles.textVertical}>
                        <Text style={styles.bold}>
                            CLAUSULA CUARTA: CONDICIONES GENERALES, PRECIO, FORMA DE PAGO:
                        </Text>
                        <Text>
                            <Text style={styles.bold}>a)</Text>
                        </Text>
                        <Text>
                            <Text style={styles.bold}>b)</Text>
                        </Text>
                    </View>
                </View> 
                */}

                {/* Signatures */}
                <View style={styles.signatureBlock}>
                    <View style={styles.signature}>
                        <Image src={signatureUrl} style={styles.managerSignature} />
                        <View style={styles.signatureLineNoSpace}></View>
                        <Text>Firma del Gerente General</Text>
                    </View>
                    <View style={styles.signature}>
                        <View style={styles.signatureLine}></View>
                        <Text>Firma de <Comprador /></Text>
                    </View>
                </View>
            </Page>
        </Document>
    );
};

export default Contrato;
