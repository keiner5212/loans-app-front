import { Document, Page, StyleSheet, Text, View, Image } from "@react-pdf/renderer";
import { FunctionComponent } from "react";

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
    signatureLabel: {
        marginTop: 5,
        fontSize: 10,
        textAlign: "center",
    },
});

interface ContratoProps {
    contractInfo: any;
    signatureUrl: string | null;
}

const Contrato: FunctionComponent<ContratoProps> = ({ contractInfo, signatureUrl }) => {
    const { user, credit, financing } = contractInfo;

    return (
        <Document>
            <Page size="LETTER" style={styles.page}>
                <Text style={styles.title}>Contrato de Crédito</Text>

                <View style={styles.section}>
                    <Text style={styles.bold}>Información del Cliente</Text>
                    <View style={styles.infoBlock}>
                        <Text>
                            <Text style={styles.bold}>Nombre: </Text>
                            {user.name}
                        </Text>
                        <Text>
                            <Text style={styles.bold}>Documento: </Text>
                            {user.document_type} {user.document}
                        </Text>
                        <Text>
                            <Text style={styles.bold}>Correo Electrónico: </Text>
                            {user.email}
                        </Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.bold}>Detalles del Crédito</Text>
                    <View style={styles.infoBlock}>
                        <Text>Monto Solicitado: ${credit.requestedAmount}</Text>
                        <Text>Tasa de Interés: {credit.interestRate}%</Text>
                        <Text>Años de Pago: {credit.yearsOfPayment}</Text>
                        <Text>Estado: {credit.status}</Text>
                    </View>
                </View>

                {financing && (
                    <View style={styles.section}>
                        <Text style={styles.bold}>Detalles de Financiación</Text>
                        <View style={styles.infoBlock}>
                            <Text>Placa del Vehículo: {financing.vehiclePlate}</Text>
                        </View>
                    </View>
                )}

                <View style={styles.signatureContainer}>
                    <View style={styles.signatureBlock}>
                        <Text>Firma del Cliente:</Text>
                        <View style={styles.signatureLine} />
                        <Text style={styles.signatureLabel}>Nombre del Cliente</Text>
                    </View>
                    <View style={styles.signatureBlock}>
                        <Text>Firma del Prestador:</Text>
                        {signatureUrl ? (
                            <Image src={signatureUrl} style={styles.signatureLine} />
                        ) : (
                            <View style={styles.signatureLine} />
                        )}
                        <Text style={styles.signatureLabel}>Nombre del Prestador</Text>
                    </View>
                </View>
            </Page>
        </Document>
    );
};

export default Contrato;
