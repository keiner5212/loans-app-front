import { FC, useCallback, useEffect, useRef, useState } from "react";
import { Layout } from "../../components/Layout";
import { FiRefreshCw } from "react-icons/fi"; 
import "../../components/tabs/tabs.css";
import SimpleModal from "../../components/modal/simpleModal/ModalSimple";
import { openContent } from "../../components/tabs";
import "./alertas.css";
import { GetLateCredits } from "../../api/credit/GetCredits";
import { debounce } from "lodash";
import { useAppStore } from "../../store/appStore";
import { useNavigate } from "react-router-dom";
import { TableContentIndvidual, TableHeaderType, TableRowType } from "../../components/Table/TableTypes";
import { formatUtcToLocal } from "../../utils/date/formatToLocal";
import { FaEnvelope, FaEye, FaWhatsapp } from "react-icons/fa";
import { TableContextProvider } from "../../components/Table/TableService";
import { TableContainer } from "../../components/Table/TableContainer";
import { Loader } from "../../components/Loader";
import { FilterPortal } from "../solicitudes/FilterPortal";
import LoaderModal from "../../components/modal/Loader/LoaderModal";
import { sendEmailNotification, sendWhatsappNotification } from "../../api/Notifications/SendNotifications";
import { getUserById } from "../../api/user/userData";
import "../solicitudes/solicitudes.css";

const rowkeys = [
  "id",
  "userId",
  "creditType",
  "userCreatorId",
  "requestedAmount",
  "interestRate",
  "yearsOfPayment",
  "period",
  "status",
  "applicationDate"
]


const columnas = [
  "ID",
  "ID de usuario",
  "Tipo de credito",
  "ID del creador",
  "Monto solicitado",
  "Tasa de interes",
  "Cantidad de años",
  "Periodo",
  "Estado",
  "Fecha de solicitud"
];

const Alertas: FC = () => {
  const defaultTabRef = useRef<HTMLButtonElement>(null);
  const [error, setError] = useState({ title: "", message: "", isOpen: false });
  const [lateCredits, setLateCredits] = useState([]);
  const [lateCreditsBackup, setLateCreditsBackup] = useState([]);
  const [loadingRequest, setLoadingRequest] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState({
    type: "",
    status: "",
  });

  const navigate = useNavigate();

  const handleMoreInfo = (id: string) => {
    navigate(`/solicitudes/${id}`);
  }
  const { theme } = useAppStore();

  const [loadingTable, setLoadingTable] = useState(false);
  const [rows, setRows] = useState<TableRowType[]>([]);
  const handleReloadCredits = useCallback(
    debounce(() => {
      setLoadingTable(true);
      GetLateCredits().then((response) => {
        setLateCredits(response.data);
        setLateCreditsBackup(response.data);
        setLoadingTable(false);
      })
    }, 300), // 300 ms de espera antes de ejecutar la función (evitar spamming de peticiones)
    []
  );

  useEffect(() => {
    let actualList = lateCreditsBackup
    if (selectedFilter.type && selectedFilter.type !== "") {
      actualList = actualList.filter((solicitud: any) => solicitud.creditType == selectedFilter.type);
    }
    if (selectedFilter.status && selectedFilter.status !== "") {
      actualList = actualList.filter((solicitud: any) => solicitud.status == selectedFilter.status);
    }
    if (search && search !== "") {
      actualList = actualList.filter((solicitud: any) =>
        JSON.stringify(solicitud).toLowerCase().includes(search.toLowerCase())
      );
    }
    setLateCredits(actualList);
  }, [selectedFilter, search]);

  useEffect(() => {
    if (defaultTabRef.current) {
      defaultTabRef.current.click();
    }
    GetLateCredits().then((response) => {
      setLateCredits(response.data);
      setLateCreditsBackup(response.data);
    })
  }, []);

  const handleSendReminderEmail = (userId: string) => {
    setLoadingRequest(true);
    getUserById(Number(userId)).then((response) => {
      const user = response;
      if (user) {
        const email = user.email;
        const message = `Hola, ${user.name}! Te recordamos que tu solicitud de crédito tiene un pago atrazado.`;
        sendEmailNotification(email, "Recordatorio de pago", message).then(() => {
          setError({
            title: "Recordatorio enviado",
            message: `Se ha enviado un recordatorio por correo a ${user.name} (${email}).`,
            isOpen: true,
          });
          setLoadingRequest(false);
        })
      } else {
        setError({
          title: "Error",
          message: "Hubo un problema enviando el recordatorio por correo.",
          isOpen: true,
        });
        setLoadingRequest(false);
      }
    }).catch(() => {
      setError({
        title: "Error",
        message: "Hubo un problema enviando el recordatorio por correo.",
        isOpen: true,
      });
      setLoadingRequest(false);
    })
  };

  const handleSendWhatsApp = (userId: string) => {
    setLoadingRequest(true);
    getUserById(Number(userId)).then((response) => {
      const user = response;
      if (user) {
        const phoneNumber = user.phone;
        const message = `Hola, ${user.name}! Te recordamos que tu solicitud de crédito tiene un pago atrazado.`;
        sendWhatsappNotification(phoneNumber, message).then(() => {
          setError({
            title: "Recordatorio enviado",
            message: `Se ha enviado un recordatorio por WhatsApp a ${user.name}  (${phoneNumber}).`,
            isOpen: true,
          });
          setLoadingRequest(false);
        })
      } else {
        setError({
          title: "Error",
          message: "Hubo un problema enviando el recordatorio por WhatsApp.",
          isOpen: true,
        })
        setLoadingRequest(false);
      }
    }).catch(() => {
      setError({
        title: "Error",
        message: "Hubo un problema enviando el recordatorio por WhatsApp.",
        isOpen: true,
      })
      setLoadingRequest(false);
    })
  };

  const headers: TableHeaderType[] = columnas.map((columna, index) => ({
    content: {
      Label: columna,
    },
    index,
    sortable: true,
    align: "center",
    hoverEffect: true,
    background: "#3f649ef4",
    color: theme === "dark" ? "#fff" : "#000",
    bold: false,
    sortMethod: undefined,
    icon: undefined,
    iconPosition: undefined,
    classname: "",
    tooltip: columna,
  }))



  useEffect(() => {
    setRows(
      lateCredits.map((fila: { [x: string]: any }) => {
        const temp: TableRowType = {
          columns: rowkeys.map((columna) => {
            const tempCol = ({
              content: {
                Label: fila[`${columna}`],
                data: fila,
              },
              onClick(event: any) {
                console.log(event);
              },
              background: "#fff",
              color: "#000",
              align: "left",
              tooltip: fila[`${columna}`].toString(),
            })
            if (columna === "applicationDate") {
              const dateFormatted = formatUtcToLocal(fila["applicationDate"], import.meta.env.VITE_LOCALE,
                import.meta.env.VITE_TIMEZONE
              )
              tempCol.content.Label = dateFormatted;
              tempCol.tooltip = dateFormatted;
            }
            return tempCol
          }) as TableContentIndvidual[],
          hoverEffect: true,
          hoverType: "individual",
          actions: [

            {
              label: "Ver detalles",
              icon: <FaEye />,
              onClick: () => handleMoreInfo(fila["id"]),
              background: "#3f649ef4",
              color: theme === "dark" ? "#fff" : "#000",
            },
            {
              label: "Enviar recordatorio por correo",
              icon: <FaEnvelope />,
              onClick: () => handleSendReminderEmail(fila["userId"]),
              background: "#ff5c64",
              color: theme === "dark" ? "#fff" : "#000",
            },
            {
              label: "Enviar recordatorio por WhatsApp",
              icon: <FaWhatsapp />,
              onClick: () => handleSendWhatsApp(fila["userId"]),
              background: "#5cff67",
              color: theme === "dark" ? "#fff" : "#000",
            }
          ],
          id: fila["id"].toString(),
        }
        return temp
      })
    )
  }, [lateCredits]);

  const [showFilterBox, setShowFilterBox] = useState(false);
  const toggleFilterBox = () => {
    setShowFilterBox(!showFilterBox);
  };

  const handleFilterChange = (e: any) => {
    const { name, value } = e.target;
    setSelectedFilter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <Layout>
      <LoaderModal isOpen={loadingRequest} />
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

        <h3>Lista de Solicitudes Atrasadas</h3>
        <div className="filter-search-container">
          <input
            type="text"
            placeholder="Buscar solicitud..."
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="filter-button" onClick={toggleFilterBox}>
            Filtros
          </button>
          <button onClick={handleReloadCredits}>
            <FiRefreshCw />
          </button>
        </div>
        <FilterPortal
          clearFilter={() => setSelectedFilter({
            type: "",
            status: "",
          })}
          show={showFilterBox}
          onClose={toggleFilterBox}
          selectedFilter={selectedFilter}
          onFilterChange={handleFilterChange}
        />
        <TableContextProvider>
          <TableContainer
            headers={headers}
            rows={rows}
            isSticky={true}
            maxHeight="60vh"
            indexed={false}
            loading={loadingTable}
            loader={
              <div
                style={{
                  padding: "20px",
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Loader size="40px" />
              </div>
            }
            roundedCorners={true}
          />
        </TableContextProvider>
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
