import { FC, useEffect, useRef, useState } from "react";
import { Layout } from "@/components/Layout";
import "@/components/tabs/tabs.css";
import { openContent } from "@/components/tabs";
import "../solicitudes/solicitudes.css";
import "./cobros.css";
import { getUserById, searchUser } from "@/api/user/userData";
import SimpleModal from "@/components/modal/simpleModal/ModalSimple";
import LoaderModal from "@/components/modal/Loader/LoaderModal";
import { GetCredit, GetCreditsByUser } from "@/api/credit/GetCredits";
import { TableContentIndvidual, TableHeaderType, TableRowType } from "@/components/Table/TableTypes";
import { useAppStore } from "@/store/appStore";
import { calculateDaysDelay, formatUtcToLocal } from "@/utils/formats/Dates";
import { FaDollarSign, FaEye, FaList, FaReceipt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { TableContextProvider } from "@/components/Table/TableService";
import { TableContainer } from "@/components/Table/TableContainer";
import { saveAs } from "file-saver";
import { Loader } from "@/components/Loader";
import { GetPaymentsOfCredit } from "@/api/payments/GetPayments";
import { Status } from "@/constants/credits/Credit";
import { obtenerDetallePeriodo } from "@/utils/amortizacion/Credit";
import { PaymentStatus } from "./Pagos";
import { PaymentFilterPortal } from "./PaymentFilterPortal";
import { FiRefreshCw } from "react-icons/fi";
import { UpdatePaymentsOfCredit } from "@/api/payments/UpdatePayment";
import { useNavigationContext } from "@/contexts/NavigationContext";
import { getConfig } from "@/api/config/GetConfig";
import { Config } from "@/constants/config/Config";
import ReciboPago from "@/pdf/ReciboPago";
import { pdf } from "@react-pdf/renderer";
import { getFile } from "@/api/files/GetFiles";

const rowkeys = [
  "id",
  "userId",
  "approvedAmount",
  "remainingDebt",
  "lateInterest",
  "creditType",
  "requestedAmount",
  "status",
  "applicationDate"
]


const columnas = [
  "ID",
  "ID de usuario",
  "Monto Aprovado",
  "Deuda Restante",
  "Interés de retraso",
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
  "Dias de retraso",
  "Interés de retraso",
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
  "lateDays",
  "lateInterest",
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
        const id = lastPage.split("/cobros/")[1];
        ReloadPayments(id);
        handleViewPayments(id);
        setLastPage(null);
      }
    }

  }, [lastPage]);

  useEffect(() => {
    setLoadingRequest(true);
    if (selectedCredit) {
      const credit = selectedCreditData.credit;
      const financing = selectedCreditData.financing;

      GetPaymentsOfCredit(selectedCredit).then(async (res) => {
        if (res.data && res.data.length > 0) {
          const dailyInerestDelay = await getConfig(Config.DAILY_INTEREST_DELAY);
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
            const lateDays = paymentData.status == PaymentStatus.LATE ? calculateDaysDelay(new Date(paymentData.timelyPayment), new Date()) :
              paymentData.status == PaymentStatus.LATE_RELEASED ? calculateDaysDelay(new Date(paymentData.timelyPayment), new Date(paymentData.paymentDate)) : 0
            const lateAmount = (lateDays * (parseFloat(dailyInerestDelay?.data.value || "0") * paymentData.amount)).toFixed(2)

            return {
              ...paymentData,
              amortization: amortization.toFixed(2),
              interest: interest.toFixed(2),
              lateDays: lateDays,
              lateInterest: lateAmount
            }
          })
          setPayments(mappedPayments);
          setPaymentsBackup(mappedPayments);
          setLoadingRequest(false);
        } else {
          setPayments([]);
          setLoadingRequest(false);
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
          setResultCredits(res.data.map((credit: any) => {
            return {
              ...credit,
              remainingDebt: credit.status == Status.CANCELED ? 0 : credit.requestedAmount - credit.approvedAmount
            }
          }));
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

  const handleGenerateReceipt = async (id: string, periodPayment: string, lateAmount: string) => {
    try {
      setLoadingRequest(true);
      const payment = paymentsBackup.find((payment: any) => payment.id == id)
      if (!payment) {
        throw new Error("Payment not found");
      };
      const credit = resultCredits.find((credit: any) => credit.id == payment["creditId"])
      if (!credit) {
        throw new Error("Credit not found");
      };
      const financing = selectedCreditData.financing || {};
      if (!financing) {
        financing["vehicleVIN"] = "";
      };
      const emplooyeId = payment["userCreatorId"];
      const signatureRes = await getConfig(Config.DOCUMENT_LOGO);
      let logoUrl = "https://th.bing.com/th/id/OIP.LmjRjBonaZtB0o-oo3CuNgAAAA?w=350&h=247&rs=1&pid=ImgDetMain"
      if (signatureRes) {
        const fileResponse = await getFile(signatureRes.data.value);
        logoUrl = URL.createObjectURL(fileResponse);
      }
      const documentNameRes = await getConfig(Config.DOCUMENT_NAME);
      const companyRegistrationRes = await getConfig(Config.COMPANY_REGISTRATION);
      const companyAddressRes = await getConfig(Config.COMPANY_ADDRESS);
      const companyPhoneRes = await getConfig(Config.COMPANY_PHONE);
      const companyEmailRes = await getConfig(Config.COMPANY_EMAIL);
      const eMployeeDataRes = await getUserById(Number(emplooyeId));
      const clientDataRes = await getUserById(Number(credit["userId"]));
      setLoadingRequest(false);
      const pdfBlob = await pdf(
        <ReciboPago
          Credittype={credit["creditType"]}
          FinancingVehicle={financing["vehicleVIN"]}
          ClientDocument={clientDataRes.document || ""}
          CompanyRegistration={companyRegistrationRes?.data.value || ""}
          ClientDocumentType={clientDataRes.document_type || ""}
          ClientEmail={clientDataRes.email || ""}
          ClientName={clientDataRes.name || ""}
          ClientPhone={clientDataRes.phone || ""}
          CompanyAddress={companyAddressRes?.data.value || ""}
          CompanyEmail={companyEmailRes?.data.value || ""}
          CompanyLogoURL={logoUrl}
          CompanyName={documentNameRes?.data.value || "Company Name"}
          CompanyPhone={companyPhoneRes?.data.value || ""}
          EmployeeDocument={eMployeeDataRes.document}
          EmployeeDocumentType={eMployeeDataRes.document_type}
          EmployeeName={eMployeeDataRes.name}
          ID={id}
          LateInterest={parseFloat(lateAmount)}
          LeftDebt={parseFloat(credit["requestedAmount"].toString()) - (parseFloat(periodPayment) * payment["period"])}
          PeriodNumber={payment["period"]}
          PeriodPayment={parseFloat(periodPayment)}
          TotalDebt={credit["requestedAmount"]}
          PaymentDate={new Date(payment["paymentDate"])}
          TotalPayment={parseFloat(periodPayment) + parseFloat(lateAmount)}
        />
      ).toBlob();
      saveAs(pdfBlob, `Recibo_Pago_${id}.pdf`);
      setModalData({
        isOpen: true,
        title: "Éxito",
        message: "El recibo de pago se ha generado y descargado correctamente.",
        button1Text: "Cerrar",
        hasTwoButtons: false,
        button2Text: "",
        closeOnOutsideClick: false,
      });
      navigate("/cobros");
    } catch (error) {
      console.error("Error al generar el PDF:", error);
      setLoadingRequest(false);
      setModalData({
        isOpen: true,
        title: "Error",
        message: "Hubo un problema al generar el recibo de pago.",
        button1Text: "Cerrar",
        hasTwoButtons: false,
        button2Text: "",
        closeOnOutsideClick: false,
      });
    }
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
            ...(fila["status"] == PaymentStatus.LATE_RELEASED || fila["status"] == PaymentStatus.RELEASED) ?
              [{
                label: "Generar recibo",
                icon: <FaReceipt />,
                onClick: () => handleGenerateReceipt(fila["id"], fila["amount"], fila["lateInterest"]),
                background: "#1f6e44",
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
              tooltip: fila[`${columna}`] ? fila[`${columna}`].toString() : "",
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
          <button onClick={handleReloadPayments} title="Recargar Pagos / Generar Nuevo pago">
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
        {selectedCredit ?
          <>{paymentsBackup.length > 0 ?
            <>
              <TableContextProvider>
                <TableContainer
                  headers={pagosHeaders}
                  rows={pagosrows}
                  isSticky={true}
                  maxHeight="50vh"
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
