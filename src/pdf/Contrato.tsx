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
        padding: 30,
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
        fontFamily: 'ArialNarrowBold',
        fontSize: 18,
        fontWeight: "bold",
        backgroundColor: "black",
        color: "white",
        textAlign: "center",
        padding: 5,
        borderRadius: 5,
    },
    section: {
        marginBottom: 15,
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
        gap: 7,
        flexDirection: "column",
    },
    centeredHorizontal: {
        display: "flex",
        gap: 7,
        flexDirection: "column",
        alignItems: "center"
    },
    textCentered: {
        textAlign: "center",
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

    const monthNames: Record<string, string> = {
        "01": "ENERO",
        "02": "FEBRERO",
        "03": "MARZO",
        "04": "ABRIL",
        "05": "MAYO",
        "06": "JUNIO",
        "07": "JULIO",
        "08": "AGOSTO",
        "09": "SEPTIEMBRE",
        "10": "OCTUBRE",
        "11": "NOVIEMBRE",
        "12": "DICIEMBRE",
    }

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
                    <View style={styles.centeredHorizontal}>
                        <View style={styles.textVertical}>
                            <Text style={styles.textCentered}><Text style={styles.bold}>{CompanyName}</Text> | {CompanyRegistration} | {day}/{month}/{year}</Text>
                        </View>
                        <View>
                            <Text>{CompanyAddress} | {CompanyPhone} | {CompanyEmail}</Text>
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
                                    El valor total a financiar el vehículo que asciende a la suma de <Text style={styles.bold}>{numeroATexto(creditAmount).toUpperCase()}
                                        LEMPIRAS (L. {formatToCurrency(creditAmount)})</Text>, pagaderos en la forma siguiente:
                                    {downPayment > 0 && (
                                        <>
                                            <Text style={styles.bold}>{numeroATexto(downPayment).toUpperCase()} LEMPIRAS (L. {formatToCurrency(downPayment)}) EN
                                                CONCEPTO DE PRIMA</Text> el valor restante
                                        </>
                                    )}
                                    <Text style={styles.bold}>L. {formatToCurrency(creditAmount - downPayment)}, en pagos a plazo de
                                        {numeroATexto(creditYears * 12).toUpperCase()} MESES
                                        ({creditYears * 12}), con un total de {numeroATexto(creditYears * creditPeriod).toUpperCase()} cuotas niveladas de manera
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
                                    El crédito otorgado asciende a la suma de <Text style={styles.bold}>{numeroATexto(creditAmount).toUpperCase()} LEMPIRAS (L. {formatToCurrency(creditAmount)}),
                                        el cual será pagado en
                                        cuotas niveladas {creditPeriod == CreditPeriod.MENSUAL
                                            ? "mensuales"
                                            : creditPeriod == CreditPeriod.SEMANAL
                                                ? "semanales"
                                                : "quincenales"} durante un plazo de {numeroATexto(creditYears * 12).toUpperCase()} MESES ({creditYears * 12}),
                                        con una cuota de L. {formatToCurrency(creditPaumentAmount)}</Text>, que se detallan
                                    en el cuadro <Text style={styles.bold}>Anexo 1</Text>. La primera cuota deberá ser cancelada el
                                    {formatUtcToLocal(
                                        calculateNextPeriodDate(new Date(), creditPeriod).toUTCString(),
                                        import.meta.env.VITE_LOCALE,
                                        import.meta.env.VITE_TIMEZONE
                                    )}, y así sucesivamente hasta completar la totalidad de los pagos, incluyendo el capital, intereses, costos
                                    y gastos relacionados. <Comprador /> y <Vendedor /> acuerdan cumplir con todas las obligaciones derivadas
                                    del presente contrato y ceder los derechos correspondientes a <Vendedor />.
                                </>
                            )}

                        </Text>
                        <Text>
                            <Text style={styles.bold}>b)</Text> Consecuentemente <Comprador />, expresamente declara sin perjuicio de satisfacer
                            el interés correspondiente, asume todos los costos administrativos, financieros adicionales y contratación de póliza
                            de seguro, que se han producido en virtud de la intermediación financiera realizada por <Vendedor />.
                        </Text>
                        <Text>
                            <Text style={styles.bold}>c)</Text> La tabla de amortización respectiva, firma y aceptada por <Comprador />,
                            informa y detalla los valores correspondientes al principal e intereses aplicables a la obligación contraída,
                            la cual forma parte integrante del presente contrato para los fines legales.
                        </Text>
                        <Text>
                            <Text style={styles.bold}>d)</Text> Los pagos se harán en el domicilio de <Vendedor /> O
                            <Text style={styles.bold}>CUENTAS BANCARIAS DE LA EMPRESA</Text>, de no realizarse el pago el día indicado, <Comprador />,
                            incurre automáticamente en mora y <Vendedor />, cargara al capital impago el interés moratorio permitido.
                        </Text>
                        <Text>
                            <Text style={styles.bold}>e)</Text> En caso que <Comprador />, incumpla con el pago DOS (2) cuotas
                            convenidas en su fecha constituirá mora y dará derecho a <Vendedor /> a dar por terminado el presente
                            contrato sin responsabilidad alguna de su parte, exigiendo judicialmente el cumplimiento del contrato
                            en su totalidad, considerándose en tal caso anticipadamente vencidos los plazos futuros, o para recuperar
                            la unidad, sin perjuicio de la facultad de reclamar del comprador el pago de las mensualidades que hayan
                            vencido mientras la unidad se encontraba en su poder. Si se resolviera el contrato, las cantidades pagadas
                            por el comprador quedarán a favor de MOTO-GANGAS en concepto de alquiler por el uso de la unidad e indemnización
                            por el deterioro sufrido por el mismo. Si se requiere la vía judicial <Comprador /> deberá hacer efectivo el
                            pago por honorarios del abogado, costas y demás gastos del cobro.
                        </Text>
                        <Text>
                            <Text style={styles.bold}>f)</Text> Pagos e intereses quedaran garantizados con la prenda que se constituye,
                            lo anterior se entenderá sin perjuicio de que la mora o negativo a efectuar dichos pagos constituya una causal
                            de incumplimiento; en virtud de la cual <Vendedor />, podrá dar por vencido el plazo de todas las obligaciones
                            de pago a cargo de <Comprador /> y exigir su pago judicial o extrajudicialmente. En el caso que <Comprador /> quiera
                            hacer una previa cancelación o pronto pago en algún momento de la vigencia del plazo con forme al <Text style={styles.bold}>Anexo 1</Text>.
                        </Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <View style={styles.textVertical}>
                        <Text style={styles.bold}>
                            CLAUSULA QUINTA, TÉRMINOS Y CONDICIONES:
                        </Text>
                        <Text>
                            <Text style={styles.bold}>a)</Text> Limitaciones: {creditType == CreditType.FINANCING ?
                                <>
                                    <Comprador />, asume los riesgos que corre la motocicleta, desde la presente
                                    fecha en que ha recibido el bien material de este contrato, por ende, no podrá vender, ni
                                    permutar, ni dar en arrendamiento, ni prendarlo, ni sacarlo fuera del territorio Nacional,
                                    mientras no haya pagado la totalidad del crédito otorgado por <Vendedor />.
                                </>
                                :
                                <>
                                    <Comprador /> asume los riesgos inherentes al uso del bien adquirido con los fondos provenientes del
                                    crédito otorgado por <Vendedor />, desde la presente fecha en que se formaliza este contrato. Por tanto,
                                    queda expresamente prohibido a <Comprador /> vender, permutar, dar en arrendamiento, prendar, o trasladar el
                                    bien fuera del territorio Nacional mientras no haya pagado la totalidad del crédito otorgado por <Vendedor />.
                                </>
                            }
                        </Text>
                        <Text>
                            <Text style={styles.bold}>b)</Text> Aceptación: {creditType == CreditType.FINANCING ? (
                                <>
                                    <Comprador />, declara haber recibido la motocicleta a su entera y total satisfacción, ratifica su aceptación a
                                    la venta realizada a su favor, así como las limitaciones correspondientes a la venta.
                                </>
                            ) : (
                                <>
                                    <Comprador /> declara haber recibido el bien adquirido a su entera y total satisfacción, ratifica su aceptación
                                    al crédito otorgado a su favor, así como las limitaciones correspondientes al uso del bien.
                                </>
                            )}
                        </Text>
                        <Text>
                            <Text style={styles.bold}>c)</Text> Mantenimiento del bien: {creditType == CreditType.FINANCING ? (
                                <>
                                    <Comprador />, se obliga a mantener en buen estado de funcionamiento la motocicleta, a pagar puntualmente todos
                                    los impuestos nacionales y municipales que lo graven. <Comprador /> también se obliga a responder por cualquier
                                    responsabilidad, sea civil, penal o mercantil que se derive de colisión, choque o cualquier accidente, sea o no
                                    directamente culpable del mismo. No puede venderla, ni hacer modificaciones mientras no cancele la deuda en su totalidad.
                                </>
                            ) : (
                                <>
                                    <Comprador />, se obliga a mantener en buen estado de funcionamiento el bien adquirido, a pagar puntualmente todos
                                    los impuestos nacionales y municipales que lo graven. <Comprador /> también se obliga a responder por cualquier
                                    responsabilidad, sea civil, penal o mercantil que se derive del uso del bien, incluyendo daños a terceros. No puede
                                    venderlo, ni hacer modificaciones mientras no cancele la deuda en su totalidad.
                                </>
                            )}
                        </Text>
                        <Text>
                            <Text style={styles.bold}>d)</Text> Autorización de la cesión: <Vendedor />, podrá ceder los derechos de este contrato exclusivamente a <Vendedor />, sin necesidad del consentimiento de
                            <Comprador />, entendiéndose que, aceptada la cesión, todos los derechos previstos a favor de <Vendedor /> y todas las
                            obligaciones serán en beneficio de <Vendedor />, quien a su vez podrá ceder total o parcialmente el presente contrato.
                        </Text>
                        <Text>
                            <Text style={styles.bold}>e)</Text> Las partes convienen que si <Comprador />, incumpliere con cualquiera de las obligaciones que contrae en el
                            presente contrato, <Vendedor />, podrá declarar de plazo vencido este contrato, sin que tenga que realizar diligencia o trámite judicial previo
                            de ninguna clase y sin que <Comprador /> tenga lugar a disponer libremente del bien antes descrito.
                        </Text>
                        <Text>
                            <Text style={styles.bold}>f)</Text> Todos los gastos e impuestos de este contrato serán de cuenta de <Comprador />, así como también los que
                            se ocasionaren por el perfeccionamiento de la venta. <Comprador /> se obliga, además, a pagar todos los gastos judiciales y extrajudiciales
                            que se deriven del juicio o cobro de las obligaciones nacidas de este contrato, incluyendo los honorarios profesionales de los Abogados que
                            contrate <Vendedor />.
                        </Text>

                        <Text>
                            <Text style={styles.bold}>g)</Text> En el caso de la matrícula de la unidad, será cubierta por <Comprador />.
                        </Text>
                        <Text>
                            <Text style={styles.bold}>h)</Text> En caso de que se instale un GPS en la unidad, el costo será cubierto por <Comprador />.
                        </Text>
                        {creditType == CreditType.FINANCING && (
                            <Text>
                                <Text style={styles.bold}>i)</Text>
                                <>
                                    <Comprador /> cubrirá los mantenimientos preventivos como ser: aceite, filtros, fricciones y neumáticos o llantas, siempre
                                    bajo términos razonables y según los kilómetros recorridos, conforme a las especificaciones del fabricante del vehículo. Los
                                    mantenimientos correctivos correrán también por cuenta de <Comprador />, pudiendo estos ser financiados o no, dependiendo del
                                    perfil de riesgo y nivel de endeudamiento de este.
                                </>
                            </Text>
                        )}

                    </View>
                </View>
                <View style={styles.section}>
                    <View style={styles.textVertical}>
                        <Text style={styles.bold}>
                            CLAUSULA SEXTA. RATIFICACION Y FIRMA:
                        </Text>
                        <Text>
                            Las partes manifestamos ser cierto lo antes expresado por ser así lo convenido y que ratificamos todas y cada una de las cláusulas de este
                            Contrato, obligándonos al fiel cumplimiento de las obligaciones aquí establecidas. En fe de lo cual firmamos el presente contrato, en la
                            ciudad de Comayagua {day == "01" ?
                                <>
                                    el dia {parseInt(day)}
                                </>
                                :
                                <>
                                    a los {parseInt(day)} dias
                                </>
                            } del mes de {monthNames[month]} del año {year}.
                        </Text>
                    </View>
                </View>

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
