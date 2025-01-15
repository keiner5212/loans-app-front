import { FC, FormEvent, useEffect, useRef, useState } from "react";
import { Layout } from "@/components/Layout";
import "@/components/tabs/tabs.css";
import { openContent } from "@/components/tabs";
import "./reportes.css";
import SimpleModal from "@/components/modal/simpleModal/ModalSimple";
import CustomCheckbox from "@/components/check";
import { useAppStore } from "@/store/appStore";
import { getReport } from "@/api/reports/getReport";
import { Status } from "@/constants/credits/Credit";
import LoaderModal from "@/components/modal/Loader/LoaderModal";
import { FaFilePdf } from "react-icons/fa";
import { PiMicrosoftExcelLogo } from "react-icons/pi";
import generateExcel from "@/utils/exports/excel";
import { generatePDF } from "@/utils/exports/pdf";
import { obtenerDetallePeriodo } from "@/utils/amortizacion/Credit";
import { PaymentStatus } from "../cobros/Pagos";
import { calculateDaysDelay } from "@/utils/formats/Dates";
import { getConfig } from "@/api/config/GetConfig";
import { Config } from "@/constants/config/Config";

const tablas = [
  "Creditos",
  "Financiamientos",
  "Pagos",
  "Usuarios", "Creditos y Financiamientos"
];

const Reportes: FC = () => {
  const defaultTabRef = useRef<HTMLButtonElement>(null);
  const [reportes, setReportes] = useState([]);
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [loadingRequest, setLoadingRequest] = useState(false);
  const [search, setSearch] = useState("");
  const { theme } = useAppStore();
  const [selectedTable, setSelectedTable] = useState("Creditos");
  const [specificUserPayments, setSpecificUserPayments] = useState(false);
  const [ModalInfo, setModalInfo] = useState({ title: "", message: "", isOpen: false });

  useEffect(() => {
    if (defaultTabRef.current) {
      defaultTabRef.current.click();
    }
  }, []);

  const getReportData = async () => {
    const data = await getReport(selectedTable, new Date(fechaDesde), new Date(fechaHasta), search)
    return data
  }

  const generarReporteExcel = async () => {
    if (reportes) {
      setLoadingRequest(true);
      await generateExcel(
        "Reporte_" + selectedTable + "_" + new Date().toLocaleDateString(),
        "Reporte de " + selectedTable,
        headers,
        reportes
      )
      setLoadingRequest(false);
      setModalInfo({ title: "Éxito", message: "Reporte generado en formato Excel.", isOpen: true });
    } else {
      setModalInfo({ title: "Error", message: "Selecciona una solicitud antes de generar el reporte.", isOpen: true });
    }
  };

  const generarReportePDF = async () => {
    if (reportes) {
      setLoadingRequest(true);
      await generatePDF(
        "Reporte_" + selectedTable + "_" + new Date().toLocaleDateString(),
        "Reporte de " + selectedTable,
        headers,
        reportes
      )
      setLoadingRequest(false);
      setModalInfo({ title: "Éxito", message: "Reporte generado en formato PDF.", isOpen: true });
    } else {
      setModalInfo({ title: "Error", message: "Selecciona una solicitud antes de generar el reporte.", isOpen: true });
    }
  };
  const [headers, setHeaders] = useState<string[]>([]);
  const aplicarFiltros = async (e: FormEvent) => {
    e.preventDefault();
    if (!fechaDesde && fechaHasta) {
      setModalInfo({ title: "Error", message: "Selecciona una fecha de inicio.", isOpen: true });
      setLoadingRequest(false);
      return
    }
    if (!fechaHasta && fechaDesde) {
      setModalInfo({ title: "Error", message: "Selecciona una fecha de fin.", isOpen: true });
      setLoadingRequest(false);
      return
    }
    setLoadingRequest(true);
    const result = await getReportData();
    if (result.data.length == 0) {
      setModalInfo({ title: "Error", message: "No se encontraron resultados.", isOpen: true });
      setLoadingRequest(false);
      return
    }
    let resultParsed = []
    setLoadingRequest(false);
    switch (selectedTable) {
      case "Creditos":
        setHeaders([...Object.keys(result.data[0].credit), "remainingDebt"])
        resultParsed = result.data.map((creditres: any) => {
          return {
            ...creditres.credit,
            remainingDebt: parseFloat((creditres.credit.status == Status.CANCELED ? 0 : creditres.credit.requestedAmount - creditres.credit.approvedAmount).toFixed(2)),
            userId: creditres.user.email
          }
        })
        break;
      case "Financiamientos":
        setHeaders([...Object.keys(result.data[0].credit), "remainingDebt", "vehicleVIN", "vehiclePlate", "vehicleDescription", "downPayment"])
        resultParsed = result.data.map((creditres: any) => {
          return {
            ...creditres.credit,
            remainingDebt: parseFloat((creditres.credit.status == Status.CANCELED ? 0 : creditres.credit.requestedAmount - creditres.credit.approvedAmount).toFixed(2)),
            userId: creditres.user.email,
            vehicleVIN: creditres.financing.vehicleVIN,
            vehiclePlate: creditres.financing.vehiclePlate,
            vehicleDescription: creditres.financing.vehicleDescription,
            downPayment: creditres.financing.downPayment
          }
        })
        break;
      case "Pagos":
        setHeaders([...Object.keys(result.data[0].payment), "amortization", "interest", "lateDays", "lateInterest"])
        const dailyInerestDelay = await getConfig(Config.DAILY_INTEREST_DELAY);
        resultParsed = result.data.map((paymentRes: any) => {
          const {
            amortization,
            interest
          } = obtenerDetallePeriodo(
            paymentRes.credit.interestRate / 100,
            paymentRes.credit.requestedAmount,
            paymentRes.financing ? paymentRes.financing.downPayment : 0,
            paymentRes.credit.yearsOfPayment * paymentRes.credit.period,
            paymentRes.credit.period,
            paymentRes.credit.period
          )
          const lateDays = paymentRes.payment.status == PaymentStatus.LATE ? calculateDaysDelay(new Date(paymentRes.payment.timelyPayment), new Date()) :
            paymentRes.payment.status == PaymentStatus.LATE_RELEASED ? calculateDaysDelay(new Date(paymentRes.payment.timelyPayment), new Date(paymentRes.payment.paymentDate)) : 0
          const lateAmount = (lateDays * (parseFloat(dailyInerestDelay?.data.value || "0") * paymentRes.payment.amount)).toFixed(2)

          return {
            ...paymentRes.payment,
            amortization: amortization.toFixed(2),
            interest: interest.toFixed(2),
            lateDays: lateDays,
            lateInterest: lateAmount
          }
        })
        break;
      case "Usuarios":
        setHeaders(Object.keys(result.data[0]).filter((key) => key !== "password"))
        resultParsed = result.data
        break;
      case "Creditos y Financiamientos":
        setHeaders([...Object.keys(result.data[0].credit), "remainingDebt", "vehicleVIN", "vehiclePlate", "vehicleDescription", "downPayment"])
        resultParsed = result.data.map((creditres: any) => {
          return {
            ...creditres.credit,
            remainingDebt: parseFloat((creditres.credit.status == Status.CANCELED ? 0 : creditres.credit.requestedAmount - creditres.credit.approvedAmount).toFixed(2)),
            userId: creditres.user.email,
            vehicleVIN: creditres.financing?.vehicleVIN,
            vehiclePlate: creditres.financing?.vehiclePlate,
            vehicleDescription: creditres.financing?.vehicleDescription,
            downPayment: creditres.financing?.downPayment
          }
        })
        break;

      default:
        break;
    }
    setReportes(resultParsed);
  };

  return (
    <Layout>
      <LoaderModal isOpen={loadingRequest} />
      <div className="tab">
        <button
          className="tablinks"
          ref={defaultTabRef}
          onClick={(event) => openContent(event, "reporte_prestamos")}
        >
          Exportar Reportes
        </button>
      </div>

      <div id="reporte_prestamos" className="tabcontent">
        <h3>Reportes de Datos</h3>

        <form className={theme}>
          <div>
            <label htmlFor="tabla-select">Tabla:</label>
            <select
              id="tabla-select"
              value={selectedTable}
              onChange={(e) => {
                setSelectedTable(e.target.value)
                setReportes([]);
              }}
            >
              {tablas.map((tabla) => (
                <option key={tabla} value={tabla}>{tabla}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="fecha-desde">Fecha Desde:</label>
            <input
              type="date"
              id="fecha-desde"
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="fecha-hasta">Fecha Hasta:</label>
            <input
              type="date"
              id="fecha-hasta"
              value={fechaHasta}
              onChange={(e) => setFechaHasta(e.target.value)}
            />
          </div>
          {["Creditos", "Creditos y Financiamientos", "Financiamientos"].includes(selectedTable) && (
            <>
              <div>
                <CustomCheckbox
                  label="Filtrar por estado de credito"
                  onChange={(checked) => setSpecificUserPayments(checked)}
                  value={specificUserPayments}
                />
              </div>
              {specificUserPayments && (
                <div>
                  <select value={search} onChange={(e) => setSearch(e.target.value)}>
                    {Object.keys(Status).map((key) => (
                      <option key={key}>{key}</option>
                    ))}
                  </select>
                </div>
              )}
            </>
          )}
          {["Pagos"].includes(selectedTable) && (
            <>
              <div>
                <CustomCheckbox
                  label="Pagos de usuario especifico"
                  onChange={(checked) => setSpecificUserPayments(checked)}
                  value={specificUserPayments}
                />
              </div>
              {specificUserPayments && (
                <div>
                  <input
                    type="text"
                    placeholder="Buscar usuario (documento o correo)..."
                    className="search-input"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              )}
            </>
          )}

          <button className="apply-button" onClick={aplicarFiltros}>Aplicar Filtros</button>
        </form>
        {reportes && reportes.length > 0 && (
          <>
            <h4>Reporte de {selectedTable} entre {fechaDesde} y {fechaHasta} tiene {reportes.length} registros</h4>
            <div className="report-result">
              <button onClick={() => generarReporteExcel()}><PiMicrosoftExcelLogo /> Generar Reporte en Excel</button>
              <button onClick={() => generarReportePDF()}><FaFilePdf /> Generar Reporte en PDF</button>
            </div>
          </>
        )}
      </div>

      {/* Modal para mostrar mensajes */}
      <SimpleModal
        isOpen={ModalInfo.isOpen}
        title={ModalInfo.title}
        message={ModalInfo.message}
        hasTwoButtons={false}
        button1Text="Ok"
        button1Action={() => {
          setModalInfo({ title: "", message: "", isOpen: false });
        }}
        closeOnOutsideClick={true}
        onClose={() => {
          setModalInfo({ title: "", message: "", isOpen: false });
        }}
      />
    </Layout>
  );
};

export default Reportes;
