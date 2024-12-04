import { useEffect, useState } from "react";
import { PDFViewer } from "@react-pdf/renderer";
import Contrato from "./Contrato";
import { getConfig } from "../api/config/GetConfig";
import { Config } from "../constants/config/Config";
import { getFile } from "../api/files/GetFiles";
import { GetCreditContractInfo } from "../api/credit/GetCredits";
import { Loader } from "../components/Loader";

const ContratoContainer = ({ id }: { id: string }) => {
    const [contractInfo, setContractInfo] = useState<any | null>(null);
    const [signatureUrl, setSignatureUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const signatureRes = await getConfig(Config.SIGNATURE);
            if (signatureRes) {
                const fileResponse = await getFile(signatureRes.data.value);
                const url = URL.createObjectURL(fileResponse);
                setSignatureUrl(url);
            }

            const contractInfoRes = await GetCreditContractInfo(parseInt(id));
            if (contractInfoRes) setContractInfo(contractInfoRes.data);
        };

        fetchData();
    }, [id]);

    if (!contractInfo) return <Loader size="40px" />;

    return (
        <PDFViewer width="100%" height="600">
            <Contrato contractInfo={contractInfo} signatureUrl={signatureUrl} />
        </PDFViewer>
    );
};

export default ContratoContainer;
