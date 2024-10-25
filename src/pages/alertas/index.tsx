import { FC, useEffect, useRef, useState } from "react";
import { Layout } from "../../components/Layout";
import { FiSend, FiMail } from "react-icons/fi"; // Import icons
import "../../components/tabs/tabs.css";
import SimpleModal from "../../components/modal/simpleModal/ModalSimple";
import { openContent } from "../../components/tabs";
import "./alertas.css"

const overdueCredits = [
  {
    id: 1,
    user: "Juan Pérez",
    email: "juan@example.com",
    document: "CC123456789",
    overdueAmount: 500000,
    dueDate: "2024-10-01",
    phone: "+57 300 1234567",
  },
  {
    id: 2,
    user: "Ana Gómez",
    email: "ana@example.com",
    document: "CC987654321",
    overdueAmount: 200000,
    dueDate: "2024-09-25",
    phone: "+57 300 9876543",
  },
];

const Alertas: FC = () => {
  const defaultTabRef = useRef<HTMLButtonElement>(null);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [error, setError] = useState({ title: "", message: "", isOpen: false });

  useEffect(() => {
    if (defaultTabRef.current) {
      defaultTabRef.current.click();
    }
  }, []);

  const handleSendReminderEmail = (user: string, email: string) => {
    // Simulate sending email reminder
    setError({
      title: "Recordatorio enviado",
      message: `Se ha enviado un recordatorio por correo a ${user} (${email}).`,
      isOpen: true,
    });
  };

  const handleSendWhatsApp = (user: string) => {
    // Simulate sending WhatsApp message
    setError({
      title: "Notificación de WhatsApp",
      message: `Se ha enviado una notificación a ${user} por WhatsApp.`,
      isOpen: true,
    });
  };

  return (
    <Layout>
      <div className="tab">
        <button
          className="tablinks"
          ref={defaultTabRef}
          onClick={(event) => openContent(event, "overdue_alerts")}
        >
          Créditos Atrasados
        </button>
      </div>

      {/* Créditos Atrasados */}
      <div id="overdue_alerts" className="tabcontent">
        <h3>Créditos Atrasados</h3>
        <table className="overdue-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Email</th>
              <th>Documento</th>
              <th>Monto Atrasado</th>
              <th>Fecha de Vencimiento</th>
              <th>Opciones</th>
            </tr>
          </thead>
          <tbody>
            {overdueCredits.map((credit) => (
              <tr key={credit.id}>
                <td>{credit.user}</td>
                <td>{credit.email}</td>
                <td>{credit.document}</td>
                <td>${credit.overdueAmount.toLocaleString()}</td>
                <td>{credit.dueDate}</td>
                <td>
                  {/* Botón para ver detalles */}
                  <button onClick={() => {
                    if(selectedUser === credit.id) {
                      setSelectedUser(null);
                    } else {
                      setSelectedUser(credit.id);
                    }
                  }}>
                    Ver Detalles
                  </button>

                  {/* Botón para enviar notificación por WhatsApp */}
                  <button onClick={() => handleSendWhatsApp(credit.user)}>
                    <FiSend /> Enviar WhatsApp
                  </button>

                  {/* Botón para enviar recordatorio por correo */}
                  <button onClick={() => handleSendReminderEmail(credit.user, credit.email)}>
                    <FiMail /> Enviar Recordatorio por Correo
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Detalles del crédito si un usuario ha sido seleccionado */}
        {selectedUser && (
          <div className="credit-details" onClick={() => setSelectedUser(null)}>
            <h4>Detalles del crédito de {overdueCredits[selectedUser - 1].user}</h4>
            <p>Email: {overdueCredits[selectedUser - 1].email}</p>
            <p>Teléfono: {overdueCredits[selectedUser - 1].phone}</p>
            <p>Monto atrasado: ${overdueCredits[selectedUser - 1].overdueAmount.toLocaleString()}</p>
            <p>Fecha de vencimiento: {overdueCredits[selectedUser - 1].dueDate}</p>
            <button onClick={() => setSelectedUser(null)}>Cerrar</button>
          </div>
        )}
      </div>

      {/* Modal para mostrar mensajes de confirmación */}
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

export default Alertas;
