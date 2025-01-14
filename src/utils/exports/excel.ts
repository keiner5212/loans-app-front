
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import noImage from "@/assets/images/noImage.jpg";
import { getConfig } from '@/api/config/GetConfig';
import { Config } from '@/constants/config/Config';
import { getFile } from '@/api/files/GetFiles';

interface DataRow {
    [key: string]: string | number;
}

const generateExcel = async (
    fileName: string,
    documentName: string,
    headers: string[],
    data: DataRow[]
): Promise<void> => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Datos');

    interface ConfigResponse {
        data: {
            value: string;
        };
    }
    // Fetch company information
    const [logoRes, documentNameRes, companyRegistrationRes, companyAddressRes, companyPhoneRes, companyEmailRes]: ConfigResponse[] =
        await Promise.all([
            getConfig(Config.DOCUMENT_LOGO),
            getConfig(Config.DOCUMENT_NAME),
            getConfig(Config.COMPANY_REGISTRATION),
            getConfig(Config.COMPANY_ADDRESS),
            getConfig(Config.COMPANY_PHONE),
            getConfig(Config.COMPANY_EMAIL)
        ]);
    // Logo por defecto
    let logoUrl = noImage;
    if (logoRes) {
        const fileResponse = await getFile(logoRes.data.value);
        logoUrl = URL.createObjectURL(fileResponse);
    }

    // Add logo to Excel file
    const logoImage = await fetch(logoUrl)
        .then((res) => res.arrayBuffer())
        .then((arrayBuffer) => new Uint8Array(arrayBuffer));

    const logoId = workbook.addImage({
        buffer: logoImage,
        extension: 'png',
    });

    // Adjust row and column sizes

    // fila vacía
    worksheet.getRow(1).height = 10;
    // columna vacía
    worksheet.getColumn(1).width = 5;

    worksheet.getRow(2).height = 70; // Logo
    worksheet.getRow(3).height = 20; // Document name
    worksheet.getRow(4).height = 20; // Company registration
    worksheet.getRow(5).height = 20; // Address
    worksheet.getRow(6).height = 20; // Phone
    worksheet.getRow(7).height = 20; // Email

    // Add logo
    worksheet.mergeCells('B2:C2'); // logo
    worksheet.mergeCells('D2:F2'); // Nombre del documento
    worksheet.addImage(logoId, {
        tl: { col: 1, row: 1 },
        ext: { width: 210, height: 93.5 },
    });

    // Add document name
    worksheet.getCell('D2').value = documentName;
    //estilo de la celda
    worksheet.getCell('D2').font = { bold: true, size: 16 };
    //alineacion
    worksheet.getCell('B2').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('D2').alignment = { vertical: 'middle', horizontal: 'center' };


    // Add company information
    const headerInfo: Array<{ cell: string; value: string; font: Partial<ExcelJS.Font> }> = [
        { cell: 'B3', value: documentNameRes?.data.value || 'Nombre de Documento', font: { size: 16 } },
        { cell: 'B4', value: companyRegistrationRes?.data.value || 'Registro de Documento', font: { size: 10 } },
        { cell: 'B5', value: companyAddressRes?.data.value || 'Dirección de Documento', font: { size: 10 } },
        { cell: 'B6', value: companyPhoneRes?.data.value || 'Teléfono de Documento', font: { size: 10 } },
        { cell: 'B7', value: companyEmailRes?.data.value || 'Email de Documento', font: { size: 10 } },
    ];

    headerInfo.forEach(({ cell, value, font }) => {
        worksheet.mergeCells(`${cell}:F${cell.charAt(1)}`);
        const wsCell = worksheet.getCell(cell);
        wsCell.value = value;
        wsCell.font = font;
        wsCell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    // Set up table
    const tableStartRow = 9;

    worksheet.getRow(tableStartRow).values = ["", ...headers];
    worksheet.getRow(tableStartRow).font = { bold: true, size: 14 };
    worksheet.getRow(tableStartRow).alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.getRow(tableStartRow).eachCell((cell) => {
        //skip first cell
        if (cell.col == "1") return
        cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
        }
    })

    worksheet.columns = [
        { key: '', width: 5 },
        ...headers.map((header) => ({
            key: header,
            width: 20
        }))
    ];

    // add data

    // Add amortization data
    data.forEach((x) => {
        const row = worksheet.addRow({
            "": "",
            ...x
        });
        row.alignment = { vertical: 'middle', horizontal: 'center' };
        row.eachCell((cell) => {
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' },
            };
        });
    });

    // Generar y guardar archivo
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    saveAs(blob, fileName);
};

export default generateExcel;