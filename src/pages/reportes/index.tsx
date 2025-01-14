import { FC, useEffect, useRef, useState } from "react";
import { Layout } from "@/components/Layout";
import "@/components/tabs/tabs.css";
import { openContent } from "@/components/tabs";
import "./reportes.css";
import SimpleModal from "@/components/modal/simpleModal/ModalSimple";
import CustomCheckbox from "@/components/check";
import { useAppStore } from "@/store/appStore";

const tablas = [
  "Creditos",
  "Financiamientos",
  "Pagos",
  "Usuarios",
];

const Reportes: FC = () => {
  const defaultTabRef = useRef<HTMLButtonElement>(null);
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [search, setSearch] = useState("");
  const { theme, userInfo } = useAppStore();
  const [selectedTable, setSelectedTable] = useState("Creditos");
  const [specificUserPayments, setSpecificUserPayments] = useState(false);
  const [ModalInfo, setModalInfo] = useState({ title: "", message: "", isOpen: false });

  useEffect(() => {
    if (defaultTabRef.current) {
      defaultTabRef.current.click();
    }
  }, []);

  const generarReporteExcel = (id: number | null, type: "prestamo" | "financiamiento") => {
    if (id) {
      console.log("Generando reporte en formato Excel...");
      setModalInfo({ title: "Éxito", message: "Reporte generado en formato Excel.", isOpen: true });
    } else {
      setModalInfo({ title: "Error", message: "Selecciona una solicitud antes de generar el reporte.", isOpen: true });
    }
  };

  const generarReportePDF = (id: number | null, type: "prestamo" | "financiamiento") => {
    if (id) {
      console.log("Generando reporte en formato PDF...");
      setModalInfo({ title: "Éxito", message: "Reporte generado en formato PDF.", isOpen: true });
    } else {
      setModalInfo({ title: "Error", message: "Selecciona una solicitud antes de generar el reporte.", isOpen: true });
    }
  };

  const aplicarFiltros = () => {
    console.log("Aplicando filtros...", { fechaDesde, fechaHasta, selectedTable, specificUserPayments, search });
    // Aquí puedes implementar la lógica para aplicar filtros
  };

  return (
    <Layout>
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
              onChange={(e) => setSelectedTable(e.target.value)}
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

          <button className="apply-button" onClick={aplicarFiltros}>Aplicar Filtros</button>
        </form>
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
