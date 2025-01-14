import { CreditType } from "@/constants/credits/Credit";
import { getDatePartsFormatted } from "@/utils/formats/Dates";
import { Document, Page, StyleSheet, Text, View, Image, Font } from "@react-pdf/renderer";
import { FunctionComponent } from "react";
import arialNarrowFont from "@/assets/fonts/arial-narrow-7-font/arial-narrow.ttf"
import arialNarrow7BoldFont from "@/assets/fonts/arial-narrow-7-font/ArialNarrow7-9YJ9n.ttf"
import { formatToCurrency } from "@/utils/formats/NumberFormats";

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
        padding: 15,
        fontSize: 9,
        fontFamily: 'ArialNarrow',
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 5,
    },
    logo: {
        width: 90,
        height: 45,
        borderRadius: 5,
    },
    title: {
        fontSize: 14,
        fontWeight: "bold",
        backgroundColor: "black",
        color: "white",
        fontFamily: 'ArialNarrowBold',
        textAlign: "center",
        padding: 4,
        borderRadius: 5,
    },
    section: {
        marginBottom: 5,
    },
    table: {
        display: "flex",
        flexDirection: "column",
        marginBottom: 5,
    },
    row: {
        flexDirection: "row",
    },
    cell: {
        flex: 1,
        padding: 2,
        borderWidth: 1,
        borderColor: "black",
    },
    cellLast: {
        flex: 1,
        padding: 2,
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
        marginTop: 30,
        gap: 5,
    },
    signature: {
        flex: 1,
        textAlign: "center",
    },
    signatureLine: {
        borderTopWidth: 1,
        marginTop: 10,
        marginBottom: 5,
    },
});

interface ReciboPagoProps {
    CompanyLogoURL: string;
    PaymentDate: Date;
    CompanyName: string;
    ID: string;
    CompanyAddress: string;
    CompanyPhone: string;
    CompanyEmail: string;
    CompanyRegistration: string;
    EmployeeName: string;
    EmployeeDocument: string;
    EmployeeDocumentType: string;
    ClientName: string;
    ClientDocument: string;
    ClientDocumentType: string;
    ClientPhone: string;
    ClientEmail: string;
    PeriodNumber: number;
    TotalDebt: number;
    LeftDebt: number;
    Credittype: CreditType;
    FinancingVehicle: string;
    PeriodPayment: {
        amortization: number;
        interest: number;
    };
    LateInterest: number;
    TotalPayment: number;
}

const ReciboPago: FunctionComponent<ReciboPagoProps> = ({
    CompanyLogoURL,
    PaymentDate,
    CompanyName,
    ID,
    CompanyAddress,
    CompanyPhone,
    CompanyEmail,
    CompanyRegistration,
    EmployeeName,
    EmployeeDocument,
    EmployeeDocumentType,
    ClientName,
    ClientDocument,
    ClientDocumentType,
    ClientPhone,
    ClientEmail,
    PeriodNumber,
    TotalDebt,
    Credittype,
    FinancingVehicle,
    LeftDebt,
    PeriodPayment,
    LateInterest,
    TotalPayment
}) => {
    const { day, month, year } = getDatePartsFormatted(PaymentDate)

    return (
        <Document>
            <Page size={{ width: 8.5 * 72, height: 5.5 * 72 }} style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Image src={CompanyLogoURL} style={styles.logo} />
                    <Text style={styles.title}>RECIBO DE PAGO</Text>
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
                            <Text style={styles.cellLast}><Text style={styles.bold}>Pago Nro.</Text> {ID}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.cell}><Text style={styles.bold}>Dirección:</Text> {CompanyAddress}</Text>
                            <Text style={styles.cell}><Text style={styles.bold}>Correo:</Text> {CompanyEmail}</Text>
                            <Text style={styles.cellLast}><Text style={styles.bold}>Teléfono:</Text> {CompanyPhone}</Text>
                        </View>
                    </View>
                </View>

                {/* Employee Info */}
                <View style={styles.section}>
                    <Text style={styles.bold}>Cobrado por:</Text>
                    <View style={styles.table}>
                        <View style={styles.row}>
                            <Text style={styles.cell}><Text style={styles.bold}>Nombre:</Text> {EmployeeName}</Text>
                            <Text style={styles.cellLast}><Text style={styles.bold}>{EmployeeDocumentType}:</Text> {EmployeeDocument}</Text>
                        </View>
                    </View>
                </View>

                {/* Client Info */}
                <View style={styles.section}>
                    <Text style={styles.bold}>Detalles del cliente:</Text>
                    <View style={styles.table}>
                        <View style={styles.row}>
                            <Text style={styles.cell}><Text style={styles.bold}>Nombre:</Text> {ClientName}</Text>
                            <Text style={styles.cellLast}><Text style={styles.bold}>{ClientDocumentType}:</Text> {ClientDocument}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.cell}><Text style={styles.bold}>Teléfono:</Text> {ClientPhone}</Text>
                            <Text style={styles.cellLast}><Text style={styles.bold}>Correo:</Text> {ClientEmail}</Text>
                        </View>
                    </View>
                </View>

                {/* Credit Details */}

                {/* Payment Details */}
                <View style={styles.section}>
                    <Text style={styles.bold}>Detalles del crédito:</Text>
                    <View style={styles.table}>
                        <View style={styles.row}>
                            {Credittype == CreditType.FINANCING ?
                                <>
                                    <Text style={styles.cell}><Text style={styles.bold}>Tipo de Credito:</Text> {Credittype}</Text>
                                    <Text style={styles.cellLast}><Text style={styles.bold}>Vehiculo de Financiamiento (VIN):</Text> {FinancingVehicle}</Text>
                                </>
                                :
                                <>
                                    <Text style={styles.cell}><Text style={styles.bold}>Tipo de Credito:</Text></Text>
                                    <Text style={styles.cellLast}>{Credittype}</Text>
                                </>
                            }

                        </View>
                        <View style={styles.row}>
                            <Text style={styles.cell}><Text style={styles.bold}>Deuda Total:</Text> ${formatToCurrency(TotalDebt)}</Text>
                            <Text style={styles.cellLast}><Text style={styles.bold}>Deuda Restante:</Text> ${formatToCurrency(LeftDebt)}</Text>
                        </View>
                    </View>
                </View>

                {/* Payment Details */}
                <View style={styles.section}>
                    <Text style={styles.bold}>Detalles del cobro:</Text>
                    <View style={styles.table}>
                        <View style={styles.row}>
                            <Text style={styles.cell}><Text style={styles.bold}>Pago del Periodo:</Text></Text>
                            <Text style={styles.cellLast}>${formatToCurrency(PeriodPayment.amortization + PeriodPayment.interest)}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.cell}><Text style={styles.bold}>Intereses por Retraso:</Text> ${formatToCurrency(LateInterest)}</Text>
                            <Text style={styles.cell}><Text style={styles.bold}>Interes cuota:</Text> ${formatToCurrency(PeriodPayment.interest)}</Text>
                            <Text style={styles.cellLast}><Text style={styles.bold}>Amortizacion cuota:</Text> ${formatToCurrency(PeriodPayment.amortization)}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.cell}><Text style={styles.bold}>Periodo No.:</Text> {PeriodNumber}</Text>
                            <Text style={styles.cellLast}><Text style={styles.bold}>Total a Pagar:</Text> ${formatToCurrency(TotalPayment)}</Text>
                        </View>
                    </View>
                </View>


                {/* Signatures */}
                <View style={styles.signatureBlock}>
                    <View style={styles.signature}>
                        <View style={styles.signatureLine}></View>
                        <Text>Firma del Encargado</Text>
                    </View>
                    <View style={styles.signature}>
                        <View style={styles.signatureLine}></View>
                        <Text>Firma de Recibido</Text>
                    </View>
                </View>
            </Page>
        </Document>
    );
};

export default ReciboPago;
