
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import noImage from "@/assets/images/noImage.jpg";

interface DataRow {
    [key: string]: string | number;
}

const generateExcel = async (
    fileName: string, // Nombre del archivo a descargar
    documentName: string, // Nombre del documento (al lado del logo)
    headers: string[], // Array de strings que representan los encabezados
    data: DataRow[] // Array de objetos cuyas llaves son las columnas
): Promise<void> => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Datos');

    // Logo por defecto
    const logoUrl = noImage;

    // Obtener logo
    const logoImage = await fetch(logoUrl)
        .then((res) => res.arrayBuffer())
        .then((arrayBuffer) => new Uint8Array(arrayBuffer));

    const logoId = workbook.addImage({
        buffer: logoImage,
        extension: 'png',
    });

    // Ajustar filas y columnas
    worksheet.getRow(1).height = 10; // Fila vacía
    worksheet.getColumn(1).width = 5; // Columna vacía

    worksheet.getRow(2).height = 70; // Logo
    worksheet.getRow(3).height = 20; // Nombre del documento

    // Insertar logo
    worksheet.mergeCells('B2:C2');
    worksheet.addImage(logoId, {
        tl: { col: 1, row: 1 },
        ext: { width: 210, height: 93.5 },
    });

    // Insertar nombre del documento
    worksheet.mergeCells('D2:F2');
    worksheet.getCell('D2').value = documentName;
    worksheet.getCell('D2').font = { bold: true, size: 16 };
    worksheet.getCell('D2').alignment = { vertical: 'middle', horizontal: 'center' };

    // Encabezados
    const headerRowIndex = 4; // Fila inicial para los encabezados
    worksheet.getRow(headerRowIndex).values = ['', ...headers];
    worksheet.getRow(headerRowIndex).font = { bold: true, size: 12 };
    worksheet.getRow(headerRowIndex).alignment = { vertical: 'middle', horizontal: 'center' };

    // Bordes para encabezados
    worksheet.getRow(headerRowIndex).eachCell((cell) => {
        if (parseInt(cell.col) > 1) {
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' },
            };
        }
    });

    // Agregar datos
    data.forEach((row) => {
        const worksheetRow = worksheet.addRow(row);
        worksheetRow.alignment = { vertical: 'middle', horizontal: 'center' };
        worksheetRow.eachCell((cell) => {
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' },
            };
        });
    });

    // Autoajustar ancho de columnas
    worksheet.columns.forEach((column) => {
        if (column.key) {
            column.width = Math.max(
                15,
                ...column.values!.filter((v) => typeof v === 'string').map((v: string) => v.length)
            );
        }
    });

    // Generar y guardar archivo
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    saveAs(blob, fileName);
};

export default generateExcel;