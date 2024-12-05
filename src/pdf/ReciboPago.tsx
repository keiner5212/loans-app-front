import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { FunctionComponent } from "react";
import { Credit } from "../pages/solicitudes/CreditDetails/Credit";

const styles = StyleSheet.create({
    page: {
        flexDirection: "column",
        backgroundColor: "#ffffff",
        padding: 40,
    },
    title: {
        fontSize: 24,
        textAlign: "center",
        fontWeight: "bold",
        marginBottom: 20,
    },
    section: {
        marginBottom: 15,
        padding: 10,
        borderBottom: "1px solid #ccc",
    },
    infoBlock: {
        marginBottom: 10,
        padding: 10,
        border: "1px solid #ddd",
        borderRadius: 5,
    },
    bold: {
        fontWeight: "bold",
    },
    signatureContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 30,
    },
    signatureBlock: {
        textAlign: "center",
        width: "45%",
    },
    signatureLine: {
        borderBottom: "1px solid #000",
        width: "100%",
        marginTop: 10,
        height: 60,
    },
});

interface ReciboPagoProps {
    credit: Credit;
    paymentAmount: number;
}

const ReciboPago: FunctionComponent<ReciboPagoProps> = ({ credit, paymentAmount }) => {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <Text style={styles.title}>Recibo de Pago</Text>
                <View style={styles.section}>
                    <Text style={styles.bold}>Información del Crédito</Text>
                    <View style={styles.infoBlock}>
                        <Text>ID del Crédito: {credit.id}</Text>
                        <Text>Monto Solicitado: ${credit.requestedAmount}</Text>
                        <Text>Tasa de Interés: {credit.interestRate}%</Text>
                        <Text>Último Pago: {credit.lastPaymentDate ?? "No disponible"}</Text>
                    </View>
                </View>
                <View style={styles.section}>
                    <Text style={styles.bold}>Detalles del Pago</Text>
                    <View style={styles.infoBlock}>
                        <Text>Monto pagado: ${paymentAmount}</Text>
                    </View>
                </View>
            </Page>
        </Document>
    );
};

export default ReciboPago;
