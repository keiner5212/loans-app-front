import { FC, useEffect, useRef, useState } from "react";
import { Layout } from "../../components/Layout";
import "../../components/tabs/tabs.css";
import "./solicitudes.css";
import { FaCheck, FaTimes } from "react-icons/fa";
import { openContent } from "../../components/tabs";

const Solicitudes: FC = () => {
  const defaultTabRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (defaultTabRef.current) {
      defaultTabRef.current.click();
    }
  }, []);

  const [user, setUser] = useState({
    name: "",
    email: "",
    document_type: "",
    document: "",
    phone: "",
  });

  const [credit, setCredit] = useState({
    requestedAmount: "",
    interestRate: "",
    numberOfPayments: "",
  });

  const handleUserChange = (e: any) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleCreditChange = (e: any) => {
    const { name, value } = e.target;
    setCredit((prevCredit) => ({ ...prevCredit, [name]: value }));
  };

  const handleSubmitSolCredito = (e: any) => {
    e.preventDefault();
    console.log("User:", user);
    console.log("Credit:", credit);
  };

  const solicitudes = [
    {
      id: 1,
      userId: 101,
      requestedAmount: 5000,
      interestRate: 5,
      numberOfPayments: 12,
      status: "pendiente",
    },
    {
      id: 2,
      userId: 102,
      requestedAmount: 10000,
      interestRate: 7,
      numberOfPayments: 24,
      status: "aprobado",
    },
  ];

  // Funciones para manejar aprobar y rechazar
  const handleApprove = (id: number) => {
    alert(`Solicitud ${id} aprobada`);
    // Lógica adicional para cambiar el estado en el backend...
  };

  const handleReject = (id: number) => {
    alert(`Solicitud ${id} rechazada`);
    // Lógica adicional para cambiar el estado en el backend...
  };

  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <Layout>
      <div className="tab">
        <button
          className="tablinks"
          ref={defaultTabRef}
          onClick={(event) => openContent(event, "sol_credito")}
        >
          Añadir solicitud de Crédito
        </button>
        <button
          className="tablinks"
          onClick={(event) => openContent(event, "sol_financiamiento")}
        >
          Añadir solicitud de Financiamiento
        </button>
        <button
          className="tablinks"
          onClick={(event) => openContent(event, "admin_solicitudes")}
        >
          Administrar solicitudes
        </button>
      </div>

      <div id="sol_credito" className="tabcontent">
        <h3>Añadir solicitud de Crédito</h3>

        <form onSubmit={handleSubmitSolCredito}>
          <h4>Datos de usuario</h4>
          <div>
            <label>Nombre:</label>
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleUserChange}
              required
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleUserChange}
              required
            />
          </div>
          <div>
            <label>Tipo de documento:</label>
            <input
              type="text"
              name="document_type"
              value={user.document_type}
              onChange={handleUserChange}
              required
            />
          </div>
          <div>
            <label>Documento:</label>
            <input
              type="text"
              name="document"
              value={user.document}
              onChange={handleUserChange}
              required
            />
          </div>
          <div>
            <label>Teléfono:</label>
            <input
              type="tel"
              name="phone"
              value={user.phone}
              onChange={handleUserChange}
              required
            />
          </div>

          <h4>Datos de solicitud</h4>
          <div>
            <label>Monto solicitado:</label>
            <input
              type="number"
              name="requestedAmount"
              value={credit.requestedAmount}
              onChange={handleCreditChange}
              required
            />
          </div>
          <div>
            <label>Tasa de interés (%):</label>
            <input
              type="number"
              name="interestRate"
              value={credit.interestRate}
              onChange={handleCreditChange}
              required
            />
          </div>
          <div>
            <label>Número de pagos:</label>
            <input
              type="number"
              name="numberOfPayments"
              value={credit.numberOfPayments}
              onChange={handleCreditChange}
              required
            />
          </div>

          <button type="submit">Enviar solicitud</button>
        </form>
      </div>

      <div id="sol_financiamiento" className="tabcontent">
        <h3>Añadir solicitud de Financiamiento</h3>

        <form onSubmit={handleSubmitSolCredito}>
          <h4>Datos de usuario</h4>
          <div>
            <label>Nombre:</label>
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleUserChange}
              required
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleUserChange}
              required
            />
          </div>
          <div>
            <label>Tipo de documento:</label>
            <input
              type="text"
              name="document_type"
              value={user.document_type}
              onChange={handleUserChange}
              required
            />
          </div>
          <div>
            <label>Documento:</label>
            <input
              type="text"
              name="document"
              value={user.document}
              onChange={handleUserChange}
              required
            />
          </div>
          <div>
            <label>Teléfono:</label>
            <input
              type="tel"
              name="phone"
              value={user.phone}
              onChange={handleUserChange}
              required
            />
          </div>

          <h4>Datos de solicitud</h4>
          <div>
            <label>Vehiculo Solicitado:</label>
            <input
              type="text"
              name="document"
              value={user.document}
              onChange={handleUserChange}
              required
            />
          </div>
          <div>
            <label>Valor del vehículo:</label>
            <input
              type="number"
              name="requestedAmount"
              value={credit.requestedAmount}
              onChange={handleCreditChange}
              required
            />
          </div>
          <div>
            <label>Tasa de interés (%):</label>
            <input
              type="number"
              name="interestRate"
              value={credit.interestRate}
              onChange={handleCreditChange}
              required
            />
          </div>
          <div>
            <label>Número de pagos:</label>
            <input
              type="number"
              name="numberOfPayments"
              value={credit.numberOfPayments}
              onChange={handleCreditChange}
              required
            />
          </div>

          <button type="submit">Enviar solicitud</button>
        </form>
      </div>

      <div id="admin_solicitudes" className="tabcontent">
        <button onClick={() => setIsAdmin(!isAdmin)}>cambiar modo</button>
        <h3>Lista de Solicitudes</h3>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {solicitudes.map((solicitud) => (
            <li
              key={solicitud.id}
              style={{
                marginBottom: "20px",
                padding: "15px",
                border: "1px solid #ddd",
                borderRadius: "5px",
              }}
            >
              <p>
                <strong>Monto Solicitado:</strong> ${solicitud.requestedAmount}
              </p>
              <p>
                <strong>Tasa de Interés:</strong> {solicitud.interestRate}%
              </p>
              <p>
                <strong>Número de Pagos:</strong> {solicitud.numberOfPayments}
              </p>

              {isAdmin ? (
                // Vista para el administrador
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <p>
                    <strong>Estado:</strong> {solicitud.status}
                  </p>
                  <div>
                    <button
                      style={{
                        marginRight: "10px",
                        backgroundColor: "#28a745",
                        color: "white",
                        padding: "8px",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleApprove(solicitud.id)}
                    >
                      <FaCheck /> Aprobar
                    </button>
                    <button
                      style={{
                        backgroundColor: "#dc3545",
                        color: "white",
                        padding: "8px",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleReject(solicitud.id)}
                    >
                      <FaTimes /> Rechazar
                    </button>
                  </div>
                </div>
              ) : (
                <p>
                  <strong>Estado de tu solicitud:</strong> {solicitud.status}
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
};

export default Solicitudes;
