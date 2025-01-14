import { getConfig } from "@/api/config/GetConfig";
import { getFile } from "@/api/files/GetFiles";
import { Config } from "@/constants/config/Config";
import noImage from "@/assets/images/noImage.jpg";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from 'file-saver';
import TablePdf from "@/pdf/generalTable";

interface DataRow {
  [key: string]: string | number;
}

export const generatePDF = async (
  fileName: string,
  documentName: string,
  headers: string[],
  data: DataRow[]) => {
  try {

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

    const pdfBlob = await pdf(
      <TablePdf
        documentName={documentName}
        CompanyAddress={companyAddressRes?.data.value || ""}
        CompanyEmail={companyEmailRes?.data.value || ""}
        CompanyLogoURL={logoUrl}
        CompanyName={documentNameRes?.data.value || ""}
        CompanyPhone={companyPhoneRes?.data.value || ""}
        CompanyRegistration={companyRegistrationRes?.data.value || ""}
        data={data}
        headers={headers}
      />
    ).toBlob();
    saveAs(pdfBlob, `${fileName}.pdf`);
  } catch (error) {
    console.error("Error al generar el PDF:", error);
  }
}