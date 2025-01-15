import { getDatePartsFormatted } from "@/utils/formats/Dates";
import { Document, Page, StyleSheet, Text, View, Image, Font } from "@react-pdf/renderer";
import { FunctionComponent } from "react";
import arialNarrowFont from "@/assets/fonts/arial-narrow-7-font/arial-narrow.ttf"
import arialNarrow7BoldFont from "@/assets/fonts/arial-narrow-7-font/ArialNarrow7-9YJ9n.ttf"

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

interface TablePdfProps {
    documentName: string;
    CompanyLogoURL: string;
    CompanyName: string;
    CompanyAddress: string;
    CompanyPhone: string;
    CompanyEmail: string;
    CompanyRegistration: string;
    data: DataRow[],
    headers: string[],
}

interface DataRow {
    [key: string]: string | number;
}

const TablePdf: FunctionComponent<TablePdfProps> = ({
    documentName,
    CompanyLogoURL,
    CompanyName,
    CompanyAddress,
    CompanyPhone,
    CompanyEmail,
    CompanyRegistration,
    data,
    headers
}) => {
    const { day, month, year } = getDatePartsFormatted(new Date());

    return (
        <Document>
            <Page size={{ width: headers.length * 80, height: 5.5 * 80 }} style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Image src={CompanyLogoURL} style={styles.logo} />
                    <Text style={styles.title}>{documentName}</Text>
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

                {/* Info */}
                <View style={styles.section}>
                    <View style={styles.table}>
                        <View style={styles.row}>
                            {
                                headers.map((header, index) => (
                                    <Text key={index} style={index != headers.length - 1 ? styles.cell : styles.cellLast}>
                                        <Text style={styles.bold}>{header}:
                                        </Text>
                                    </Text>
                                ))
                            }
                        </View>
                        {
                            data.map((row, rowIndex) => (
                                <View key={rowIndex} style={styles.row}>
                                    {
                                        headers.map((header, index) => (
                                            <Text key={index} style={index != headers.length - 1 ? styles.cell : styles.cellLast}>
                                                {row[header]}
                                            </Text>
                                        ))
                                    }
                                </View>
                            ))
                        }
                    </View>
                </View>
            </Page>
        </Document>
    );
};

export default TablePdf;
