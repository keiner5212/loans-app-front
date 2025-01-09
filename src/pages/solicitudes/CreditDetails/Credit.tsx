import { FunctionComponent, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { GetCredit } from "@/api/credit/GetCredits";
import "./details.css";
import { LoaderScreen } from "@/components/Loader/LoaderScreen";
import { useAppStore } from "@/store/appStore";
import { CreditType } from "@/constants/credits/Credit";
import { getFile } from "@/api/files/GetFiles";

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
            <span className="field-value">{value !== null ? value : "No data"}</span>
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
                        {renderField("User ID", <Link to={`/usuarios/${credit.userId}`}>{credit.userId}</Link>)}
                        {renderField("Credit Type", credit.creditType)}
                        {renderField("User Creator ID", credit.userCreatorId)}
                        {renderField("Requested Amount", `$${credit.requestedAmount}`)}
                        {renderField("Interest Rate", `${credit.interestRate}%`)}
                        {renderField("Years of Payment", credit.yearsOfPayment)}
                        {renderField("Period", credit.period)}
                        {renderField("Status", credit.status)}
                        {renderField("Application Date", credit.applicationDate)}
                        {renderField("Approved Date", credit.aprovedDate)}
                        {renderField("Rejected Date", credit.rejectedDate)}
                        {renderField("Released Date", credit.releasedDate)}
                        {renderField("Finished Date", credit.finishedDate)}
                        {renderField("Last Payment Period", credit.lastPaymentPeriod)}
                        {renderField("Last Payment Date", credit.lastPaymentDate)}
                        {credit.signedContract && renderField("Signed Contract URL",
                            <a href={contractSignedUrl || ""} target="_blank" >View Signed Contract</a>
                        )}
                        {renderField("Signed Contract", credit.signedContract)}
                        {credit.creditType == CreditType.FINANCING && <>
                            {
                                financing &&
                                <>
                                    {renderField("Financing ID", financing.id)}
                                    {renderField("Vehicle Plate", financing.vehiclePlate)}
                                    {renderField("Vehicle VIN", financing.vehicleVIN)}
                                    {renderField("Vehicle Description", financing.vehicleDescription)}
                                    {renderField("Down Payment", `$${financing.downPayment}`)}
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
