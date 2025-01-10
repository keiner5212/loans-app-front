import { FunctionComponent, useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Link, useNavigate, useParams } from "react-router-dom";
import SimpleModal from "@/components/modal/simpleModal/ModalSimple";
import LoaderModal from "@/components/modal/Loader/LoaderModal";
import { Credit } from "../solicitudes/CreditDetails/Credit";
import { GetCredit } from "@/api/credit/GetCredits";
import { calcularPago } from "@/utils/amortizacion/Credit";
import "../solicitudes/solicitudes.css";
import "./cobros.css"
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import ReciboPago from "../../pdf/ReciboPago";
import { CreatePayment } from "@/api/payments/CreatePayment";
import { useAppStore } from "@/store/appStore";

export enum PaymentStatus {
    PENDING = "PENDING",
    LATE = "LATE",
    RELEASED = "RELEASED",
    LATE_RELEASED = "LATE_RELEASED",
}

interface PagoProps {

}

const Pago: FunctionComponent<PagoProps> = () => {
    const { id } = useParams();
    const [credit, setCredit] = useState<Credit | null>(null);
    const [loadingRequest, setLoadingRequest] = useState(false);
    const [financing, setFinancing] = useState<any | null>(null);
    const navigate = useNavigate();
    // what it has to payed
    const [periodPayment, setPeriodPayment] = useState<any | null>(null);
    const [modalData, setModalData] = useState({
        isOpen: false,
        title: "",
        message: "",
        hasTwoButtons: false,
        button1Text: "",
        button2Text: "",
        closeOnOutsideClick: false,
    });

    const closeModal = () => {
        setModalData({
            isOpen: false,
            title: "",
            message: "",
            hasTwoButtons: false,
            button1Text: "",
            button2Text: "",
            closeOnOutsideClick: false,
        });
    }

    useEffect(() => {
        setLoadingRequest(true);
        if (id) {
            GetCredit(Number(id))
                .then((response) => {
                    setCredit(response.data.credit);
                    if (response.data.financing) {
                        setFinancing(response.data.financing);
                    }
                })
                .catch((error) => {
                    console.error("Error fetching credit:", error);
                })
                .finally(() => {
                    setLoadingRequest(false);
                });
        }
    }, [id]);

    useEffect(() => {
        if (credit) {
            if (credit.lastPaymentPeriod == (credit.yearsOfPayment * credit.period)) {
                setModalData({
                    isOpen: true,
                    title: "Error",
                    message: "El Credito ya ha sido pagado.",
                    button1Text: "Cerrar",
                    hasTwoButtons: false,
                    button2Text: "",
                    closeOnOutsideClick: false,
                });
                navigate(-1);
                return
            }

            let downPayment = 0;
            if (financing) {
                downPayment = financing.downPayment;
            }
            setPeriodPayment(calcularPago(credit.interestRate / 100, credit.requestedAmount, downPayment,
                credit.yearsOfPayment * credit.period, credit.period
            ));
        }
    }, [financing, credit]);

    const handleGoback = () => {
        navigate(-1);
    };

    const { theme, userInfo } = useAppStore();

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoadingRequest(true);
        if (!credit || !periodPayment) return;

        const res = await CreatePayment({
            creditId: credit.id,
            userCreatorId: userInfo.id,
            amount: periodPayment,
            period: credit.lastPaymentPeriod ? credit.lastPaymentPeriod + 1 : 1,
            date: new Date().toISOString(),
        })

        if (!res) {
            setModalData({
                isOpen: true,
                title: "Error",
                message: "Hubo un problema al generar el recibo de pago.",
                button1Text: "Cerrar",
                hasTwoButtons: false,
                button2Text: "",
                closeOnOutsideClick: false,
            });
            return;
        }

        setLoadingRequest(false);
        try {
            const pdfBlob = await pdf(
                <ReciboPago credit={credit} paymentAmount={periodPayment} />
            ).toBlob();
            saveAs(pdfBlob, `Recibo_Pago_${credit.id}.pdf`);
            setModalData({
                isOpen: true,
                title: "Éxito",
                message: "El recibo de pago se ha generado y descargado correctamente.",
                button1Text: "Cerrar",
                hasTwoButtons: false,
                button2Text: "",
                closeOnOutsideClick: false,
            });
            navigate("/cobros");
        } catch (error) {
            console.error("Error al generar el PDF:", error);
            setModalData({
                isOpen: true,
                title: "Error",
                message: "Hubo un problema al generar el recibo de pago.",
                button1Text: "Cerrar",
                hasTwoButtons: false,
                button2Text: "",
                closeOnOutsideClick: false,
            });
        }
    };

    return (
        <Layout>
            <SimpleModal
                isOpen={modalData.isOpen}
                title={modalData.title}
                message={modalData.message}
                hasTwoButtons={modalData.hasTwoButtons}
                button1Text={modalData.button1Text}
                button1Action={closeModal}
                button2Text={modalData.button2Text}
                button2Action={closeModal}
                closeOnOutsideClick={true}
                onClose={closeModal}
            />
            <LoaderModal isOpen={loadingRequest} />
            <div className="details-container">
                <div className="details-header">
                    <button onClick={handleGoback} className="back-button">
                        Go back
                    </button>
                </div>
                <div className="layout-container">
                    <div className={"payment-container " + theme}>
                        {credit ? (
                            <form className="payment-form" onSubmit={handlePayment} >
                                <h1>Realizar cobro</h1>
                                <div>
                                    <label>Capital a pagar</label>
                                    <input type="text" value={periodPayment ? "$" + periodPayment : 0} disabled />
                                </div>
                                <div>
                                    <label>Información del credito</label>
                                    <span>
                                        <Link to={`/solicitudes/${credit.id}`} >Ver</Link>
                                    </span>
                                </div>
                                <div>
                                    <button>
                                        Confirmar cobro y generar recibo
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div>
                                <h1>No se encontraron datos</h1>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Pago;