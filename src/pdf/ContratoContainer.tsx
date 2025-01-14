import { useEffect, useState } from "react";
import { PDFViewer } from "@react-pdf/renderer";
import Contrato from "./Contrato";
import { getConfig } from "../api/config/GetConfig";
import { Config } from "../constants/config/Config";
import { getFile } from "../api/files/GetFiles";
import { GetCreditContractInfo } from "../api/credit/GetCredits";
import { Loader } from "../components/Loader";
import noImage from "@/assets/images/noImage.jpg";
import { CreditType } from "@/constants/credits/Credit";
import { calcularPago } from "@/utils/amortizacion/Credit";

const ContratoContainer = ({ id }: { id: string }) => {
    const [signatureUrl, setSignatureUrl] = useState<string>(noImage);
    const [logoUrl, setLogoUrl] = useState<string>(noImage);
    const [creditInfo, setCreditInfo] = useState<any>(null);
    const [userInfo, setUserInfo] = useState<any>(null);
    const [financingInfo, setFinancingInfo] = useState<any>(null);
    const [companyInfo, setCompanyInfo] = useState({
        documentName: "",
        companyRegistration: "",
        companyAddress: "",
        companyPhone: "",
        companyEmail: "",
    });
    const [loading, setLoading] = useState(true);

    const fetchConfigValue = async (configKey: string, fallback: string = "") => {
        const res = await getConfig(configKey);
        return res?.data.value || fallback;
    };

    const fetchFileUrl = async (configKey: string) => {
        const configRes = await getConfig(configKey);
        if (!configRes) return noImage;
        const fileRes = await getFile(configRes.data.value);
        return URL.createObjectURL(fileRes);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch credit contract info
                const contractInfoRes = await GetCreditContractInfo(parseInt(id));
                if (!contractInfoRes) return;
                const { user, credit, financing } = contractInfoRes.data;
                setCreditInfo(credit);
                setUserInfo(user);
                setFinancingInfo(financing);

                // Fetch company data and assets
                const [signatUrl, logoUrlRes, documentName, companyRegistration, companyAddress, companyPhone, companyEmail] = await Promise.all([
                    fetchFileUrl(Config.SIGNATURE),
                    fetchFileUrl(Config.DOCUMENT_LOGO),
                    fetchConfigValue(Config.DOCUMENT_NAME),
                    fetchConfigValue(Config.COMPANY_REGISTRATION),
                    fetchConfigValue(Config.COMPANY_ADDRESS),
                    fetchConfigValue(Config.COMPANY_PHONE),
                    fetchConfigValue(Config.COMPANY_EMAIL),
                ]);

                setSignatureUrl(signatUrl);
                setLogoUrl(logoUrlRes);
                setCompanyInfo({
                    documentName,
                    companyRegistration,
                    companyAddress,
                    companyPhone,
                    companyEmail,
                });
            } catch (error) {
                console.error("Error fetching contract data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) return <Loader size="40px" />;

    return (
        <PDFViewer width="100%" height="600">
            <Contrato
                CompanyAddress={companyInfo.companyAddress}
                CompanyEmail={companyInfo.companyEmail}
                CompanyLogoURL={logoUrl}
                CompanyName={companyInfo.documentName}
                CompanyPhone={companyInfo.companyPhone}
                CompanyRegistration={companyInfo.companyRegistration}
                ContractDate={new Date()}
                FinancingVehicle={financingInfo?.vehicleVIN || ""}
                clientDocument={userInfo?.document || ""}
                clientName={userInfo?.name || ""}
                creditType={(creditInfo?.creditType as CreditType) || CreditType.FINANCING}
                signatureUrl={signatureUrl}
                creditAmount={creditInfo?.requestedAmount || 0}
                creditPaumentAmount={calcularPago(creditInfo?.interestRate / 100, creditInfo?.requestedAmount || 0,
                    financingInfo?.downPayment || 0,
                    creditInfo?.yearsOfPayment * parseInt(creditInfo?.period), parseInt(creditInfo.period))}
                creditPeriod={creditInfo?.period || 0}
                creditYears={creditInfo?.yearsOfPayment || 0}
                downPayment={financingInfo?.downPayment || 0}
            />
        </PDFViewer>
    );
};

export default ContratoContainer;
