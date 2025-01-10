import { FC, useEffect, useRef, useState } from "react";
import { Layout } from "@/components/Layout";
import "@/components/tabs/tabs.css";
import { openContent } from "@/components/tabs";
import "../solicitudes/solicitudes.css";
import "./cobros.css";
import { searchUser } from "@/api/user/userData";
import SimpleModal from "@/components/modal/simpleModal/ModalSimple";
import LoaderModal from "@/components/modal/Loader/LoaderModal";
import { GetCredit, GetCreditsByUser } from "@/api/credit/GetCredits";
import { TableContentIndvidual, TableHeaderType, TableRowType } from "@/components/Table/TableTypes";
import { useAppStore } from "@/store/appStore";
import { formatUtcToLocal } from "@/utils/formats/formatToLocal";
import { FaDollarSign, FaEye, FaList } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { TableContextProvider } from "@/components/Table/TableService";
import { TableContainer } from "@/components/Table/TableContainer";
import { Loader } from "@/components/Loader";
import { GetPaymentsOfCredit } from "@/api/payments/GetPayments";
import { Status } from "@/constants/credits/Credit";
import { obtenerDetallePeriodo } from "@/utils/amortizacion/Credit";
import { PaymentStatus } from "./Pagos";
import { PaymentFilterPortal } from "./PaymentFilterPortal";
import { FiRefreshCw } from "react-icons/fi";
import { UpdatePaymentsOfCredit } from "@/api/payments/UpdatePayment";
import { useNavigationContext } from "@/contexts/NavigationContext";

// TODO: eliminar la opcion de pagar credito desde la tabla de creditos, que se pague directamente en la tabla de pagos

const rowkeys = [
  "id",
  "userId",
  "creditType",
  "requestedAmount",
  "status",
  "applicationDate"
]


const columnas = [
  "ID",
  "ID de usuario",
  "Tipo de credito",
  "Monto solicitado",
  "Estado",
  "Fecha de solicitud"
];

const pagosColumnas = [
  "ID",
  "Monto",
  "Amortización",
  "Interés",
  "ID del creador",
  "Estado",
  "Fecha de pago",
  "Fecha de pago oportuno",
  "Periodo"
]

const pagosRowKeys = [
  "id",
  "amount",
  "amortization",
  "interest",
  "userCreatorId",
  "status",
  "paymentDate",
  "timelyPayment",
  "period"
]

const Cobros: FC = () => {
  const defaultTabRef = useRef<HTMLButtonElement>(null)
  const pagosTabRef = useRef<HTMLButtonElement>(null)
  const [search, setSearch] = useState("");
  const [paymentsSearch, setPaymentsSearch] = useState("");
  const [user, setUser] = useState<any>();
  const [resultCredits, setResultCredits] = useState<any[]>([]);
  const [rows, setRows] = useState<TableRowType[]>([]);
  const [pagosrows, setPagosRows] = useState<TableRowType[]>([]);
  const { theme } = useAppStore();
  const [loadingRequest, setLoadingRequest] = useState(false);
  const [selectedCredit, setSelectedCredit] = useState<any>(null);
  const [modalData, setModalData] = useState({
    isOpen: false,
    title: "",
    message: "",
    hasTwoButtons: false,
    button1Text: "",
    button2Text: "",
    closeOnOutsideClick: false,
  });
  const { lastPage, setLastPage } = useNavigationContext();
  const [showFilterBox, setShowFilterBox] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<PaymentStatus | null>(null);
  const toggleFilterBox = () => {
    setShowFilterBox(!showFilterBox);
  };

  const [paymentsBackup, setPaymentsBackup] = useState([]);
  const [payments, setPayments] = useState([]);

  const [reloadFlag, setReloadFlag] = useState(false);

  const [selectedCreditData, setSelectedCreditData] = useState<any>({});

  useEffect(() => {
    if (lastPage) {
      if (lastPage.startsWith("/cobros")) {
        ReloadPayments(lastPage.split("/cobros/")[1]);
        setLastPage(null);
      }
    }

  }, [lastPage]);

  useEffect(() => {
    setLoadingRequest(true);
    if (selectedCredit) {
      const credit = selectedCreditData.credit;
      const financing = selectedCreditData.financing;

      GetPaymentsOfCredit(selectedCredit).then((res) => {
        setLoadingRequest(false);
        if (res.data && res.data.length > 0) {
          const mappedPayments = res.data.map((paymentData: any) => {
            const {
              amortization,
              interest
            } = obtenerDetallePeriodo(
              credit.interestRate / 100,
              credit.requestedAmount,
              financing ? financing.downPayment : 0,
              credit.yearsOfPayment * credit.period,
              credit.period,
              paymentData.period
            )

            return {
              ...paymentData,
              amortization: amortization.toFixed(2),
              interest: interest.toFixed(2)
            }
          })
          setPayments(mappedPayments);
          setPaymentsBackup(mappedPayments);
        } else {
          setPayments([]);
        }
      })
    } else {
      setPayments([]);
      setLoadingRequest(false);
    }
  }, [selectedCredit, reloadFlag])

  useEffect(() => {
    if (selectedFilter || paymentsSearch) {
      let filteredPayments = paymentsBackup;
      if (selectedFilter) {
        filteredPayments = paymentsBackup.filter((payment: any) => payment.status === selectedFilter);
      }
      // filter search
      if (paymentsSearch !== "") {
        filteredPayments = filteredPayments.filter((payment: any) => {
          console.log(JSON.stringify(payment).toLowerCase());
          console.log(paymentsSearch.toLowerCase());
          return JSON.stringify(payment).toLowerCase().includes(paymentsSearch.toLowerCase())
        }
        );
      } else { }
      setPayments(filteredPayments);
    } else {
      setPayments(paymentsBackup);
    }
  }, [selectedFilter, paymentsSearch]);


  useEffect(() => {
    if (defaultTabRef.current) {
      defaultTabRef.current.click();
    }
  }, []);

  useEffect(() => {
    setLoadingRequest(true);
    if (user) {
      GetCreditsByUser(user.id).then((res) => {
        setLoadingRequest(false);
        if (res.data && res.data.length > 0) {
          setResultCredits(res.data);
        } else {
          setResultCredits([]);
          setModalData({
            isOpen: true,
            title: "Error",
            message: "No se encontraron creditos para el usuario",
            hasTwoButtons: false,
            button1Text: "Ok",
            button2Text: "",
            closeOnOutsideClick: false,
          })
        }
      })
    } else {
      setResultCredits([]);
      setLoadingRequest(false);
    }
  }, [user]);

  const handleSearchUser = () => {
    setLoadingRequest(true);
    searchUser(search).then((res) => {
      setLoadingRequest(false);
      if (res.user) {
        setUser(res.user);
      } else {
        setModalData({
          isOpen: true,
          title: "Error",
          message: "No se encontraron resultados",
          hasTwoButtons: false,
          button1Text: "Ok",
          button2Text: "",
          closeOnOutsideClick: false,
        })
      }
    })
  };


  const closeModal = () => {
    setModalData({
      isOpen: false,
      title: "",
      message: "",
      hasTwoButtons: false,
      button1Text: "",
      button2Text: "",
      closeOnOutsideClick: false,
    });
  }


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

  const pagosHeaders: TableHeaderType[] = pagosColumnas.map((columna, index) => ({
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

  const navigate = useNavigate();

  const handleMoreInfo = (id: string) => {
    navigate(`/solicitudes/${id}`);
  }

  const handleViewPayments = (id: string) => {
    setLoadingRequest(true);
    GetCredit(parseInt(id)).then((res) => {
      setLoadingRequest(false);
      setSelectedCredit(id);

      setSelectedCreditData(res.data);
      pagosTabRef.current?.click();
    })
  }

  const handleDoPayment = (id: string) => {
    navigate(`/solicitudes/pagos/${id}`);
  }

  useEffect(() => {
    if (!payments) return
    setPagosRows(
      payments.map((fila: { [x: string]: any }) => {
        const temp: TableRowType = {
          columns: pagosRowKeys.map((columna) => {
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
              tooltip: fila[`${columna}`]?.toString(),
            })
            if (columna === "paymentDate") {
              let dateFormatted = formatUtcToLocal(fila["paymentDate"], import.meta.env.VITE_LOCALE,
                import.meta.env.VITE_TIMEZONE
              )
              if (!dateFormatted) {
                dateFormatted = "Sin fecha"
              }
              tempCol.content.Label = dateFormatted;
              tempCol.tooltip = dateFormatted;
            }
            if (columna === "status") {
              tempCol.tooltip = fila["status"] == PaymentStatus.PENDING ? "No ha pagado" : fila["status"];
            }
            if (columna === "userCreatorId") {
              let text = fila["userCreatorId"];
              if (!text) {
                text = "No definido"
              }
              tempCol.content.Label = text;
              tempCol.tooltip = text;
            }
            if (columna === "timelyPayment") {
              const dateFormatted = formatUtcToLocal(fila["timelyPayment"], import.meta.env.VITE_LOCALE,
                import.meta.env.VITE_TIMEZONE
              )
              tempCol.content.Label = dateFormatted;
              tempCol.tooltip = dateFormatted;
            }
            return tempCol
          }) as TableContentIndvidual[],
          actions: [
            ...(fila["status"] == PaymentStatus.PENDING || fila["status"] == PaymentStatus.LATE) ?
              [{
                label: "Realizar cobro",
                icon: <FaDollarSign />,
                onClick: () => handleDoPayment(fila["id"]),
                background: "#3f649ef4",
                color: theme === "dark" ? "#fff" : "#000",
              }
              ] : [],
          ],
          hoverEffect: true,
          hoverType: "row",
          id: fila["id"].toString(),
        }
        return temp
      })
    )
  }, [payments])

  useEffect(() => {
    if (!resultCredits) return
    setRows(
      resultCredits.map((fila: { [x: string]: any }) => {
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
          hoverType: "row",
          actions: [
            {
              label: "Ver detalles",
              icon: <FaEye />,
              onClick: () => handleMoreInfo(fila["id"]),
              background: "#3f649ef4",
              color: theme === "dark" ? "#fff" : "#000",
            },
            ...((fila["status"] === Status.RELEASED || fila["status"] === Status.LATE) ? [
              {
                label: "Ver pagos",
                icon: <FaList />,
                onClick: () => handleViewPayments(fila["id"]),
                background: "#3f649ef4",
                color: theme === "dark" ? "#fff" : "#000",
              },
            ] : [])
          ],
          id: fila["id"].toString(),
        }
        return temp
      })
    )
  }, [resultCredits]);

  function handleReloadPayments() {
    ReloadPayments(selectedCredit);
  }

  function ReloadPayments(creditId: string | undefined) {
    setLoadingRequest(true);
    if (creditId) {
      UpdatePaymentsOfCredit(creditId).then(() => {
        setLoadingRequest(false);
        setReloadFlag(!reloadFlag);
      });
    } else {
      setLoadingRequest(false);
      setReloadFlag(!reloadFlag);
    }
  }

  const handleFilterChange = (e: any) => {
    const { value } = e.target;
    setSelectedFilter(value);
  };

  return (
    <Layout>
      <SimpleModal
        isOpen={modalData.isOpen}
        title={modalData.title}
        message={modalData.message}
        hasTwoButtons={modalData.hasTwoButtons}
        button1Text={modalData.button1Text}
        button1Action={closeModal}
        button2Text={modalData.button2Text}
        button2Action={closeModal}
        closeOnOutsideClick={true}
        onClose={closeModal}
      />
      <LoaderModal isOpen={loadingRequest} />
      <div className="tab">
        <button
          className="tablinks"
          ref={defaultTabRef}
          onClick={(event) => openContent(event, "cobro_credito")}
        >
          Añadir/Realizar Cobro
        </button>
        <button
          ref={pagosTabRef}
          className="tablinks"
          onClick={(event) => openContent(event, "admin_pagos")}
        >
          Administrar Pagos
        </button>
      </div>

      <div id="cobro_credito" className="tabcontent">
        <h3>Añadir/Realizar Cobro</h3><div className="filter-search-container">
          <input
            type="text"
            placeholder="Buscar usuario (documento o correo)..."
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={handleSearchUser} className="btn btn-primary">
            Buscar
          </button>
        </div>


        <TableContextProvider>
          <TableContainer
            headers={headers}
            rows={rows}
            isSticky={true}
            maxHeight="60vh"
            indexed={false}
            loading={false}
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

      {/* Segunda Tab - Administrar Pagos */}
      <div id="admin_pagos" className="tabcontent">
        <h3>Administrar Pagos</h3>
        {selectedCredit ?
          <>{paymentsBackup.length > 0 ?
            <>
              <div className="filter-search-container">
                <input
                  type="text"
                  placeholder="Buscar pago..."
                  className="search-input"
                  value={paymentsSearch}
                  onChange={(e) => setPaymentsSearch(e.target.value)}
                />
                <button className="filter-button" onClick={toggleFilterBox}>
                  Filtros
                </button>
                <button onClick={handleReloadPayments}>
                  <FiRefreshCw />
                </button>
              </div>
              <PaymentFilterPortal
                clearFilter={() => setSelectedFilter(null)}
                show={showFilterBox}
                onClose={toggleFilterBox}
                selectedFilter={selectedFilter}
                onFilterChange={handleFilterChange}
              />
              <TableContextProvider>
                <TableContainer
                  headers={pagosHeaders}
                  rows={pagosrows}
                  isSticky={true}
                  maxHeight="60vh"
                  indexed={false}
                  loading={false}
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
            </> :
            <ul className="solicitudes-list">
              <li className="solicitud-item">
                <p>Este credito no tiene pagos</p>
              </li></ul>
          }
          </> :
          <ul className="solicitudes-list">
            <li className="solicitud-item">
              <p>Busca un usuario y selecciona un credito para ver los pagos</p>
            </li>
          </ul>
        }
      </div>
    </Layout>
  );
};

export default Cobros;
