import { FunctionComponent, useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Link, useNavigate, useParams } from "react-router-dom";
import SimpleModal from "@/components/modal/simpleModal/ModalSimple";
import LoaderModal from "@/components/modal/Loader/LoaderModal";
import { Credit } from "../solicitudes/CreditDetails/Credit";
import { GetCredit } from "@/api/credit/GetCredits";
import "../solicitudes/solicitudes.css";
import "./cobros.css"
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import ReciboPago from "../../pdf/ReciboPago";
import noImage from "@/assets/images/noImage.jpg"
import { CreatePayment } from "@/api/payments/CreatePayment";
import { useAppStore } from "@/store/appStore";
import { useNavigationContext } from "@/contexts/NavigationContext";
import { GetPayment } from "@/api/payments/GetPayments";
import { calculateDaysDelay } from "@/utils/formats/Dates";
import { getConfig } from "@/api/config/GetConfig";
import { Config } from "@/constants/config/Config";
import { getUserById } from "@/api/user/userData";
import { getFile } from "@/api/files/GetFiles";
import { CreditType } from "@/constants/credits/Credit";
import { obtenerDetallePeriodo } from "@/utils/amortizacion/Credit";

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
    const [lateAmount, setLateAmount] = useState(0);
    const [paymentId, setPaymentID] = useState<number | null | undefined>(null);
    const [payment, setPayment] = useState<any | null | undefined>(null);
    const navigate = useNavigate();
    const { setLastPage } = useNavigationContext();

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
            GetPayment(Number(id))
                .then(async (response) => {
                    setPaymentID(Number(id));
                    setPayment(response.data);
                    const dailyInerestDelay = await getConfig(Config.DAILY_INTEREST_DELAY);
                    const lateDays = response.data.status == PaymentStatus.LATE ? calculateDaysDelay(new Date(response.data.timelyPayment), new Date()) : 0
                    const lateAmountCalculated = (lateDays * (parseFloat(dailyInerestDelay?.data.value || "0") * response.data.amount)).toFixed(2)
                    setLateAmount(parseFloat(lateAmountCalculated));
                    setPeriodPayment(response.data.amount);
                    GetCredit(response.data.creditId).then((res) => {
                        setCredit(res.data.credit);
                        setLastPage("/cobros/" + res.data.credit.id);
                        if (res.data.financing) {
                            setFinancing(res.data.financing);
                        }
                    })
                        .catch((error) => {
                            console.error("Error fetching credit:", error);
                        })
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
        }
    }, [financing, credit]);

    const handleGoback = () => {
        navigate(-1);
    };

    const { theme, userInfo } = useAppStore();

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoadingRequest(true);
        if (!credit || !periodPayment || !paymentId || !userInfo?.id || !payment) {
            setModalData({
                isOpen: true,
                title: "Error",
                message: "Hubo un problema al generar el recibo de pago.",
                button1Text: "Cerrar",
                hasTwoButtons: false,
                button2Text: "",
                closeOnOutsideClick: false,
            });
            return
        };
        const res = await CreatePayment(
            paymentId,
            userInfo.id,
            lateAmount
        )

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

        handleGenerateReceipt(paymentId.toString(), periodPayment, lateAmount.toString());
    };


    const handleGenerateReceipt = async (id: string, periodPayment: string, lateAmount: string) => {
        try {
            if (!payment) {
                throw new Error("Payment not found");
            };
            if (!credit) {
                throw new Error("Credit not found");
            };
            const localFinancing = financing || {}
            if (!localFinancing) {
                localFinancing["vehicleVIN"] = "";
            };
            const emplooyeId = userInfo.id;
            const signatureRes = await getConfig(Config.DOCUMENT_LOGO);
            let logoUrl = noImage
            if (signatureRes) {
                const fileResponse = await getFile(signatureRes.data.value);
                logoUrl = URL.createObjectURL(fileResponse);
            }
            const documentNameRes = await getConfig(Config.DOCUMENT_NAME);
            const companyRegistrationRes = await getConfig(Config.COMPANY_REGISTRATION);
            const companyAddressRes = await getConfig(Config.COMPANY_ADDRESS);
            const companyPhoneRes = await getConfig(Config.COMPANY_PHONE);
            const companyEmailRes = await getConfig(Config.COMPANY_EMAIL);
            const eMployeeDataRes = await getUserById(Number(emplooyeId));
            const clientDataRes = await getUserById(Number(credit["userId"]));
            const {
                amortization,
                interest
            } = obtenerDetallePeriodo(
                credit.interestRate / 100,
                credit.requestedAmount,
                financing?.downPayment ? financing.downPayment : 0,
                credit.yearsOfPayment * credit.period,
                credit.period,
                payment["period"]
            )
            setLoadingRequest(false);
            const pdfBlob = await pdf(
                <ReciboPago
                    Credittype={credit["creditType"] as CreditType}
                    FinancingVehicle={localFinancing["vehicleVIN"]}
                    ClientDocument={clientDataRes.document || ""}
                    CompanyRegistration={companyRegistrationRes?.data.value || ""}
                    ClientDocumentType={clientDataRes.document_type || ""}
                    ClientEmail={clientDataRes.email || ""}
                    ClientName={clientDataRes.name || ""}
                    ClientPhone={clientDataRes.phone || ""}
                    CompanyAddress={companyAddressRes?.data.value || ""}
                    CompanyEmail={companyEmailRes?.data.value || ""}
                    CompanyLogoURL={logoUrl}
                    CompanyName={documentNameRes?.data.value || "Company Name"}
                    CompanyPhone={companyPhoneRes?.data.value || ""}
                    EmployeeDocument={eMployeeDataRes.document}
                    EmployeeDocumentType={eMployeeDataRes.document_type}
                    EmployeeName={eMployeeDataRes.name}
                    ID={id}
                    LateInterest={parseFloat(lateAmount)}
                    LeftDebt={parseFloat((parseFloat(credit["requestedAmount"].toString()) - (parseFloat(periodPayment) * payment["period"])).toFixed(2))}
                    PeriodNumber={payment["period"]}
                    PeriodPayment={
                        {
                            amortization: amortization,
                            interest: interest
                        }
                    }
                    TotalDebt={credit["requestedAmount"]}
                    PaymentDate={new Date(payment["paymentDate"])}
                    TotalPayment={parseFloat(periodPayment) + parseFloat(lateAmount)}
                />
            ).toBlob();
            saveAs(pdfBlob, `Recibo_Pago_${id}.pdf`);
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
            setLoadingRequest(false);
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
    }

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
                            <>
                                <form className="payment-form" onSubmit={handlePayment}>
                                    <h1>Realizar cobro</h1>
                                    <div>
                                        <p>Monto del período: ${periodPayment || 0}</p>
                                        <p>Cargos por retraso: ${lateAmount || 0}</p>
                                        <label>Capital a pagar</label>
                                        <input
                                            type="text"
                                            value={periodPayment ? "$" + (lateAmount + parseFloat(periodPayment)) : 0}
                                            disabled
                                        />
                                    </div>
                                    <div>
                                        <label>Información del crédito</label>
                                        <span>
                                            <Link to={`/solicitudes/${credit.id}`}>Ver</Link>
                                        </span>
                                    </div>
                                    <div>
                                        <button>
                                            Confirmar cobro y generar recibo
                                        </button>
                                    </div>
                                </form>
                            </>
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