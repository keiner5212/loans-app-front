import { FC, useEffect, useRef, useState } from "react";
import { Layout } from "../../components/Layout";
import "../../components/tabs/tabs.css";
import { openContent } from "../../components/tabs";
import "./reportes.css";
import SimpleModal from "../../components/modal/simpleModal/ModalSimple";

// Solicitudes de prueba
const prestamosPrueba = [
  {
    id: 1,
    nombre: "Juan Pérez",
    monto: 5000,
    fecha: "2024-01-10",
    estado: "Aprobado",
  },
  {
    id: 2,
    nombre: "Ana García",
    monto: 3000,
    fecha: "2024-02-15",
    estado: "Pendiente",
  },
  {
    id: 3,
    nombre: "Luis Martínez",
    monto: 7000,
    fecha: "2024-03-01",
    estado: "Rechazado",
  },
];

const financiamientosPrueba = [
  {
    id: 1,
    nombre: "María López",
    monto: 10000,
    fecha: "2024-01-20",
    estado: "Aprobado",
  },
  {
    id: 2,
    nombre: "Pedro Sánchez",
    monto: 8000,
    fecha: "2024-02-25",
    estado: "Pendiente",
  },
  {
    id: 3,
    nombre: "Lucía Torres",
    monto: 15000,
    fecha: "2024-03-15",
    estado: "Aprobado",
  },
];

const Reportes: FC = () => {
  const defaultTabRef = useRef<HTMLButtonElement>(null);
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("Todos");
  const [selectedPrestamoId, setSelectedPrestamoId] = useState<number | null>(null);
  const [selectedFinanciamientoId, setSelectedFinanciamientoId] = useState<number | null>(null);
  const [error, setError] = useState({ title: "", message: "", isOpen: false });

  useEffect(() => {
    if (defaultTabRef.current) {
      defaultTabRef.current.click();
    }
  }, []);

  const generarReporteExcel = (id: number | null, type: "prestamo" | "financiamiento") => {
    if (id) {
      console.log("Generando reporte en formato Excel...");
      setError({ title: "Éxito", message: "Reporte generado en formato Excel.", isOpen: true });
    } else {
      setError({ title: "Error", message: "Selecciona una solicitud antes de generar el reporte.", isOpen: true });
    }
  };

  const generarReportePDF = (id: number | null, type: "prestamo" | "financiamiento") => {
    if (id) {
      console.log("Generando reporte en formato PDF...");
      setError({ title: "Éxito", message: "Reporte generado en formato PDF.", isOpen: true });
    } else {
      setError({ title: "Error", message: "Selecciona una solicitud antes de generar el reporte.", isOpen: true });
    }
  };

  const aplicarFiltros = () => {
    console.log("Aplicando filtros:", { fechaDesde, fechaHasta, estadoFiltro });
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
          Reportes de Préstamos
        </button>
        <button
          className="tablinks"
          onClick={(event) => openContent(event, "reporte_financiamientos")}
        >
          Reportes de Financiamientos
        </button>
      </div>

      <div id="reporte_prestamos" className="tabcontent">
        <h3>Reportes de Préstamos</h3>
        <div>
          <input
            type="date"
            value={fechaDesde}
            onChange={(e) => setFechaDesde(e.target.value)}
            placeholder="Fecha Desde"
          />
          <input
            type="date"
            value={fechaHasta}
            onChange={(e) => setFechaHasta(e.target.value)}
            placeholder="Fecha Hasta"
          />
          <select
            value={estadoFiltro}
            onChange={(e) => setEstadoFiltro(e.target.value)}
          >
            <option value="Todos">Todos</option>
            <option value="Aprobado">Aprobado</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Rechazado">Rechazado</option>
          </select>
          <button onClick={aplicarFiltros}>Aplicar Filtros</button>
        </div>
        <button onClick={() => generarReporteExcel(selectedPrestamoId, "prestamo")}>Generar Reporte Excel</button>
        <button onClick={() => generarReportePDF(selectedPrestamoId, "prestamo")}>Generar Reporte PDF</button>

        <h4>Solicitudes de Préstamos:</h4>
        <ul>
          {prestamosPrueba.map((prestamo) => (
            <li
              key={prestamo.id}
              className={selectedPrestamoId === prestamo.id ? "selected" : ""}
              onClick={() => {
                if(selectedPrestamoId === prestamo.id) {
                  setSelectedPrestamoId(null);
                } else {
                  setSelectedPrestamoId(prestamo.id);
                }
              }}
            >
              {prestamo.nombre} - Monto: L{prestamo.monto} - Fecha: {prestamo.fecha} - Estado: {prestamo.estado}
            </li>
          ))}
        </ul>
      </div>

      {/* Tab: Reportes de Financiamientos */}
      <div id="reporte_financiamientos" className="tabcontent">
        <h3>Reportes de Financiamientos</h3>
        <div>
          <input
            type="date"
            value={fechaDesde}
            onChange={(e) => setFechaDesde(e.target.value)}
            placeholder="Fecha Desde"
          />
          <input
            type="date"
            value={fechaHasta}
            onChange={(e) => setFechaHasta(e.target.value)}
            placeholder="Fecha Hasta"
          />
          <select
            value={estadoFiltro}
            onChange={(e) => setEstadoFiltro(e.target.value)}
          >
            <option value="Todos">Todos</option>
            <option value="Aprobado">Aprobado</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Rechazado">Rechazado</option>
          </select>
          <button onClick={aplicarFiltros}>Aplicar Filtros</button>
        </div>
        <button onClick={() => generarReporteExcel(selectedFinanciamientoId, "financiamiento")}>Generar Reporte Excel</button>
        <button onClick={() => generarReportePDF(selectedFinanciamientoId, "financiamiento")}>Generar Reporte PDF</button>

        <h4>Solicitudes de Financiamientos:</h4>
        <ul>
          {financiamientosPrueba.map((financiamiento) => (
            <li
              key={financiamiento.id}
              className={selectedFinanciamientoId === financiamiento.id ? "selected" : ""}
              onClick={() => {
                if(selectedFinanciamientoId === financiamiento.id){
                  setSelectedFinanciamientoId(null);
                } else {
                  setSelectedFinanciamientoId(financiamiento.id);
                }
              }}
            >
              {financiamiento.nombre} - Monto: L{financiamiento.monto} - Fecha: {financiamiento.fecha} - Estado: {financiamiento.estado}
            </li>
          ))}
        </ul>
      </div>

      {/* Modal para mostrar mensajes */}
      <SimpleModal
        isOpen={error.isOpen}
        title={error.title}
        message={error.message}
        hasTwoButtons={false}
        button1Text="Ok"
        button1Action={() => {
          setError({ title: "", message: "", isOpen: false });
        }}
        closeOnOutsideClick={true}
        onClose={() => {
          setError({ title: "", message: "", isOpen: false });
        }}
      />
    </Layout>
  );
};

export default Reportes;
