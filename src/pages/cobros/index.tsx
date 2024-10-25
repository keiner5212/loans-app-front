import { FC, useEffect, useRef, useState } from "react";
import { Layout } from "../../components/Layout";
import "../../components/tabs/tabs.css";
import { openContent } from "../../components/tabs";

const Cobros: FC = () => {
  const defaultTabRef = useRef<HTMLButtonElement>(null);
  const [userId, setUserId] = useState("");
  const [selectedSolicitud, setSelectedSolicitud] = useState<any>();
  // const [payments, setPayments] = useState([]);

  useEffect(() => {
    if (defaultTabRef.current) {
      defaultTabRef.current.click();
    }
  }, []);

  const handleSearchUser = () => {
    // Simular búsqueda de solicitud de crédito de usuario por ID
    setSelectedSolicitud({
      id: 1,
      requestedAmount: 5000,
      paidAmount: 2000,
      remainingAmount: 3000,
      payments: 4,
      totalPayments: 10,
    });
  };

  const solicitudesDemo = [
    { id: 1, userId: 101, requestedAmount: 5000, paidAmount: 2000, payments: 4, totalPayments: 10 },
    { id: 2, userId: 102, requestedAmount: 10000, paidAmount: 4000, payments: 6, totalPayments: 24 },
  ];

  return (
    <Layout>
      <div className="tab">
        <button
          className="tablinks"
          ref={defaultTabRef}
          onClick={(event) => openContent(event, "cobro_credito")}
        >
          Añadir/Realizar Cobro
        </button>
        <button
          className="tablinks"
          onClick={(event) => openContent(event, "admin_pagos")}
        >
          Administrar Pagos
        </button>
      </div>

      {/* Primera Tab - Añadir/Realizar Cobro */}
      <div id="cobro_credito" className="tabcontent">
        <h3>Añadir/Realizar Cobro</h3>
        <div style={{ marginBottom: "20px" }}>
          <label>Buscar usuario por ID: </label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Ingresa ID de usuario"
            style={{ marginRight: "10px", padding: "5px", borderRadius: "5px", border: "1px solid #ccc" }}
          />
          <button
            onClick={handleSearchUser}
            style={{ padding: "5px 10px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px" }}
          >
            Buscar
          </button>
        </div>

        {selectedSolicitud && (
          <div style={{ border: "1px solid #ccc", padding: "15px", borderRadius: "5px" }}>
            <h4>Solicitud de Crédito</h4>
            <p><strong>Monto Solicitado:</strong> ${selectedSolicitud.requestedAmount}</p>
            <p><strong>Monto Pagado:</strong> ${selectedSolicitud.paidAmount}</p>
            <p><strong>Saldo Pendiente:</strong> ${selectedSolicitud.remainingAmount}</p>
            <p><strong>Cuotas Pagadas:</strong> {selectedSolicitud.payments}/{selectedSolicitud.totalPayments}</p>
            <button
              style={{ padding: "5px 10px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "5px", marginRight: "10px" }}
            >
              Generar Recibo
            </button>
            <button
              style={{ padding: "5px 10px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px" }}
            >
              Realizar Cobro
            </button>
          </div>
        )}
      </div>

      {/* Segunda Tab - Administrar Pagos */}
      <div id="admin_pagos" className="tabcontent">
        <h3>Administrar Pagos</h3>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {solicitudesDemo.map((solicitud) => (
            <li key={solicitud.id} style={{ marginBottom: "20px", padding: "15px", border: "1px solid #ddd", borderRadius: "5px" }}>
              <p><strong>Solicitud ID:</strong> {solicitud.id}</p>
              <p><strong>Monto Solicitado:</strong> ${solicitud.requestedAmount}</p>
              <p><strong>Monto Pagado:</strong> ${solicitud.paidAmount}</p>
              <p><strong>Progreso de Pagos:</strong> {solicitud.payments}/{solicitud.totalPayments}</p>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
};

export default Cobros;
