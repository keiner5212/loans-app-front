import { CreditType } from "@/constants/credits/Credit";
import { getDatePartsFormatted } from "@/utils/formats/Dates";
import { Document, Page, StyleSheet, Text, View, Image } from "@react-pdf/renderer";
import { FunctionComponent } from "react";

const styles = StyleSheet.create({
    page: {
        padding: 20,
        fontSize: 10,
        fontFamily: 'Helvetica',
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
        marginBottom: 10,
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
    PeriodPayment: number;
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
            <Page size="A4" style={styles.page}>
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
                            <Text style={styles.cell}><Text style={styles.bold}>Dia:</Text> {day}</Text>
                            <Text style={styles.cell}><Text style={styles.bold}>Mes:</Text> {month}</Text>
                            <Text style={styles.cellLast}><Text style={styles.bold}>Año:</Text> {year}</Text>
                            <Text style={styles.cellLast}><Text style={styles.bold}>Pago Nro.</Text> {ID}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.cell}><Text style={styles.bold}>RTN:</Text> {CompanyRegistration}</Text>
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
                            <Text style={styles.cell}><Text style={styles.bold}>Nombre:</Text></Text>
                            <Text style={styles.cellLast}><Text>{ClientName}</Text></Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.cell}><Text style={styles.bold}>{ClientDocumentType}:</Text></Text>
                            <Text style={styles.cellLast}><Text>{ClientDocument}</Text></Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.cell}><Text style={styles.bold}>Teléfono:</Text></Text>
                            <Text style={styles.cellLast}><Text>{ClientPhone}</Text></Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.cell}><Text style={styles.bold}>Correo:</Text></Text>
                            <Text style={styles.cellLast}><Text>{ClientEmail}</Text></Text>
                        </View>
                    </View>
                </View>

                {/* Credit Details */}

                {/* Payment Details */}
                <View style={styles.section}>
                    <Text style={styles.bold}>Detalles del cobro:</Text>
                    <View style={styles.table}>
                        <View style={styles.row}>
                            <Text style={styles.cell}><Text style={styles.bold}>Tipo de Credito:</Text></Text>
                            <Text style={styles.cellLast}>{Credittype}</Text>
                        </View>
                        {Credittype == CreditType.FINANCING &&
                            <View style={styles.row}>
                                <Text style={styles.cell}><Text style={styles.bold}>Vehiculo de Financiamiento (VIN):</Text></Text>
                                <Text style={styles.cellLast}>{FinancingVehicle}</Text>
                            </View>
                        }
                        <View style={styles.row}>
                            <Text style={styles.cell}><Text style={styles.bold}>Deuda Total:</Text></Text>
                            <Text style={styles.cellLast}>${TotalDebt}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.cell}><Text style={styles.bold}>Deuda Restante:</Text></Text>
                            <Text style={styles.cellLast}>${LeftDebt}</Text>
                        </View>
                    </View>
                </View>

                {/* Payment Details */}
                <View style={styles.section}>
                    <Text style={styles.bold}>Detalles del cobro:</Text>
                    <View style={styles.table}>
                        <View style={styles.row}>
                            <Text style={styles.cell}><Text style={styles.bold}>Periodo No.:</Text></Text>
                            <Text style={styles.cellLast}>{PeriodNumber}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.cell}><Text style={styles.bold}>Pago del Periodo:</Text></Text>
                            <Text style={styles.cellLast}>${PeriodPayment}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.cell}><Text style={styles.bold}>Intereses por Retraso:</Text></Text>
                            <Text style={styles.cellLast}>${LateInterest}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.cell}><Text style={styles.bold}>Total a Pagar:</Text></Text>
                            <Text style={styles.cellLast}>${TotalPayment}</Text>
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
