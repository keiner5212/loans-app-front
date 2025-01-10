import { FunctionComponent, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { GetCredit } from "@/api/credit/GetCredits";
import "./details.css";
import { LoaderScreen } from "@/components/Loader/LoaderScreen";
import { useAppStore } from "@/store/appStore";
import { CreditType } from "@/constants/credits/Credit";
import { getFile } from "@/api/files/GetFiles";
import { formatUtcToLocal } from "@/utils/formats/Dates";

export interface Credit {
    id: number;
    userId: number;
    creditType: string;
    userCreatorId: number;
    requestedAmount: number;
    interestRate: number;
    yearsOfPayment: number;
    period: number;
    status: string;
    applicationDate: string;
    aprovedDate: string | null;
    rejectedDate: string | null;
    releasedDate: string | null;
    finishedDate: string | null;
    lastPaymentDate: string | null;
    lastPaymentPeriod: number | null;
    signedContract: string | null;
    approvedAmount: number | null;
    lateInterest: number | null;
    finishedMessage: string | null;
}

const CreditDetails: FunctionComponent = () => {
    const { id } = useParams();
    const [credit, setCredit] = useState<Credit | null>(null);
    const [financing, setFinancing] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { theme } = useAppStore();
    const [contractSignedUrl, setSignatureUrl] = useState<string | null>(null);

    useEffect(() => {
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
                    setLoading(false);
                });
        }
    }, [id]);

    const handleGoback = () => {
        navigate(-1);
    };

    useEffect(() => {
        if (credit) {
            const getContract = async (signedContract: string) => {
                const fileResponse = await getFile(signedContract);
                const url = URL.createObjectURL(fileResponse);
                setSignatureUrl(url);
            }

            if (credit.signedContract) {
                getContract(credit.signedContract);
            }
        }
    }, [credit]);

    const renderField = (label: string, value: any) => (
        <div className={"details-field" + " " + theme}>
            <span className="field-label">{label}:</span>
            <span className="field-value">{value ? value : "No data"}</span>
        </div>
    );

    if (loading) {
        return (
            <Layout>
                <LoaderScreen />
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="details-container">
                <div className="details-header">
                    <button onClick={handleGoback} className="back-button">
                        Go back
                    </button>
                </div>
                {credit ? (
                    <div className="details-grid">
                        {renderField("ID", credit.id)}
                        {renderField("ID del Usuario", <Link to={`/usuarios/${credit.userId}`}>{credit.userId}</Link>)}
                        {renderField("Tipo de Credito", credit.creditType)}
                        {renderField("Empleado creador", <Link to={`/usuarios/${credit.userCreatorId}`}>{credit.userCreatorId}</Link>)}
                        {renderField("Cantidad solicitada", `$${credit.requestedAmount}`)}
                        {renderField("Tasa de Interés", `${credit.interestRate}%`)}
                        {renderField("Años de Pago", credit.yearsOfPayment)}
                        {renderField("Periodos", credit.period)}
                        {renderField("Estado", credit.status)}
                        {renderField("Fecha de Applicación",
                            formatUtcToLocal(credit.applicationDate, import.meta.env.VITE_LOCALE, import.meta.env.VITE_TIMEZONE)
                        )}
                        {renderField("Fecha de Aprobación",
                            formatUtcToLocal(credit.aprovedDate, import.meta.env.VITE_LOCALE, import.meta.env.VITE_TIMEZONE)
                        )}
                        {renderField("Fecha de Rechazo",
                            formatUtcToLocal(credit.rejectedDate, import.meta.env.VITE_LOCALE, import.meta.env.VITE_TIMEZONE)
                        )}
                        {renderField("Fecha de Desembolso",
                            formatUtcToLocal(credit.releasedDate, import.meta.env.VITE_LOCALE, import.meta.env.VITE_TIMEZONE)
                        )}
                        {renderField("Fecha de Finalización",
                            formatUtcToLocal(credit.finishedDate, import.meta.env.VITE_LOCALE, import.meta.env.VITE_TIMEZONE)
                        )}
                        {renderField("Cantidad Aprobada", `$${credit.approvedAmount}`)}
                        {renderField("Interés por Mora", `$${credit.lateInterest}`)}
                        {renderField("Mensaje de Finalización", credit.finishedMessage || "No hay mensaje de finalización")}

                        {renderField("Ultimo Periodo Pagado", credit.lastPaymentPeriod)}
                        {renderField("Fecha de Ultimo Pago",
                            formatUtcToLocal(credit.lastPaymentDate, import.meta.env.VITE_LOCALE, import.meta.env.VITE_TIMEZONE)
                        )}
                        {credit.signedContract && renderField("Contrato Firmado",
                            <a href={contractSignedUrl || ""} target="_blank" >View Signed Contract</a>
                        )}
                        {renderField("Contrato Firmado", credit.signedContract)}
                        {credit.creditType == CreditType.FINANCING && <>
                            {
                                financing &&
                                <>
                                    {renderField("ID de Financiamiento", financing.id)}
                                    {renderField("Placa del Vehiculo", financing.vehiclePlate)}
                                    {renderField("VIN del Vehiculo", financing.vehicleVIN)}
                                    {renderField("Descripcion del Vehiculo", financing.vehicleDescription)}
                                    {renderField("Anticipo", `$${financing.downPayment}`)}
                                </>
                            }
                        </>}
                    </div>
                ) : (
                    <p>No credit data found.</p>
                )}
            </div>
        </Layout>
    );
};

export default CreditDetails;
