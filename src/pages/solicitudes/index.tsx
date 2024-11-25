import { FC, useEffect, useRef, useState } from "react";
import { Layout } from "../../components/Layout";
import "../../components/tabs/tabs.css";
import "./solicitudes.css";
import { FaCheck, FaTimes } from "react-icons/fa";
import { openContent } from "../../components/tabs";
import { useAppStore } from "../../store/appStore";
import { TableContextProvider } from "../../components/Table/TableService";
import { TableContainer } from "../../components/Table/TableContainer";
import { TableHeaderType, TableRowType } from "../../components/Table/TableTypes";

const Solicitudes: FC = () => {
  const defaultTabRef = useRef<HTMLButtonElement>(null);
  const { theme } = useAppStore();

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
    edad: 0,
  });

  const [credit, setCredit] = useState({
    requestedAmount: "",
    interestRate: "",
    numberOfPayments: "",
    yearsOfPayment: "",
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
    }
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

  const rowkeys = [
    "id",
    "requestedAmount",
    "interestRate",
    "numberOfPayments",
  ]


  const columnas = [
    "ID",
    "Monto Solicitado",
    "Tasa de Interés",
    "Número de cuotas"
  ];

  const headers: TableHeaderType[] = columnas.map((columna, index) => ({
    content: {
      Label: columna,
    },
    index,
    sortable: true,
    align: "center",
    hoverEffect: true,
    background: "#b7b7b7",
    color: "#000",
    bold: false,
    sortMethod: undefined,
    icon: undefined,
    iconPosition: undefined,
    classname: "",
    tooltip: columna,
  }))


  const rows: TableRowType[] = solicitudes.map((fila: { [x: string]: any }) => ({
    columns: rowkeys.map((columna) => ({
      content: {
        Label: fila[`${columna}`],
        data: fila,
      },
      onClick(event) {
        console.log(event);
      },
      background: "#fff",
      color: "#000",
      align: "left",
      tooltip: columna.toString(),
    })),
    hoverEffect: true,
    hoverType: "individual",
    actions: [],
    id: fila["id"].toString(),
  }))


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

        <form onSubmit={handleSubmitSolCredito} className={theme} >
          <h4 id="user-data-sub">Datos de usuario</h4>
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
            <label>Edad:</label>
            <input
              type="number"
              name="edad"
              value={user.edad}
              onChange={handleUserChange}
              required
            />
          </div>
          <div>
            <label>Ubicacion (croquis):</label>
            <input
              type="file"
              required
            />
          </div>
          <div>
            <label>Documento (cara de frente):</label>
            <input
              type="file"
              required
            />
          </div>
          <div>
            <label>Documento (cara de atras):</label>
            <input
              type="file"
              required
            />
          </div>
          <div>
            <label>Constancia de ingresos:</label>
            <input
              type="file"
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

          <h4 id="request-data-sub">Datos de solicitud</h4>
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
            <label>Tiempo de pago (años):</label>
            <input
              type="number"
              name="yearsOfPayment"
              value={credit.yearsOfPayment}
              onChange={handleCreditChange}
              required
            />
          </div>
          <div>
            <label>Forma de pago:</label>
            <select name="paymentMethod">
              <option value="mensual">Mensual</option>
              <option value="semanal">Semanal</option>
              <option value="quincenal">Quincenal</option>
            </select>
          </div>
          <div>
            <label>Número de cuotas:</label>
            <input
              type="number"
              disabled
              name="numberOfPayments"
              value={credit.numberOfPayments}
              onChange={handleCreditChange}
            />
          </div>

          <button type="submit">Enviar solicitud</button>
        </form>
      </div>

      <div id="sol_financiamiento" className="tabcontent">
        <h3>Añadir solicitud de Financiamiento</h3>

        <form onSubmit={handleSubmitSolCredito} className={theme} >
          <h4 id="user-data-sub">Datos de usuario</h4>
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
            <label>Edad:</label>
            <input
              type="number"
              name="edad"
              value={user.edad}
              onChange={handleUserChange}
              required
            />
          </div>
          <div>
            <label>Ubicacion (croquis):</label>
            <input
              type="file"
              required
            />
          </div>
          <div>
            <label>Documento (cara de frente):</label>
            <input
              type="file"
              required
            />
          </div>
          <div>
            <label>Documento (cara de atras):</label>
            <input
              type="file"
              required
            />
          </div>
          <div>
            <label>Constancia de ingresos:</label>
            <input
              type="file"
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

          <h4 id="request-data-sub">Datos de solicitud</h4>
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
            <label>Tiempo de pago (años):</label>
            <input
              type="number"
              name="yearsOfPayment"
              value={credit.yearsOfPayment}
              onChange={handleCreditChange}
              required
            />
          </div>
          <div>
            <label>Forma de pago:</label>
            <select name="paymentMethod">
              <option value="mensual">Mensual</option>
              <option value="semanal">Semanal</option>
              <option value="quincenal">Quincenal</option>
            </select>
          </div>
          <div>
            <label>Número de cuotas:</label>
            <input
              type="number"
              disabled
              name="numberOfPayments"
              value={credit.numberOfPayments}
              onChange={handleCreditChange}
            />
          </div>
          <button type="submit">Enviar solicitud</button>
        </form>
      </div>

      <div id="admin_solicitudes" className="tabcontent">
        <h3>Lista de Solicitudes</h3>

        <TableContextProvider>
          <TableContainer
            headers={headers}
            rows={rows}
            isSticky={true}
            maxHeight="60vh"
            // indexed={true}
            loading={false}
            loader={null}
            indexColHeaderColor="#000"
            indexColHeaderBackgroundColor="#b7b7b7"
            roundedCorners={true}
          />
        </TableContextProvider>
      </div>
    </Layout>
  );
};

export default Solicitudes;
