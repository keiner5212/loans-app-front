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
import { hasPermision } from "../../utils/security/Permisions";
import { Roles } from "../../constants/permisions/Roles";
import { Loader } from "../../components/Loader";
import { getConfig } from "../../api/config/GetConfig";
import { Config } from "../../constants/config/Config";
import SimpleModal from "../../components/modal/simpleModal/ModalSimple";
import { uploadFile } from "../../api/files/UploadFile";
import { CreateUser } from "../../api/user/CreateUser";
import LoaderModal from "../../components/modal/Loader/LoaderModal";
import { deleteFile } from "../../api/files/DeleteFiles";
import { CreateCredit, CreateFinancing } from "../../api/credit/CreateCredit";
import { Status } from "../../constants/credits/Credit";

const Solicitudes: FC = () => {
  const [loadingRequest, setLoadingRequest] = useState(false);
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
  const [modalData, setModalData] = useState({
    isOpen: false,
    title: "",
    message: "",
    hasTwoButtons: false,
    button1Text: "",
    button2Text: "",
    closeOnOutsideClick: false,
  });

  const defaultTabRef = useRef<HTMLButtonElement>(null);
  const { theme, userInfo } = useAppStore();
  const [interestRate, setInterestRate] = useState(0);

  useEffect(() => {
    if (defaultTabRef.current) {
      defaultTabRef.current.click();
    }
    getConfig(Config.INTEREST_RATE).then((res) => setInterestRate(parseFloat(res?.data.value) * 100));
  }, []);

  const [user, setUser] = useState<any>({
    name: undefined,
    age: undefined,
    locationCroquis: null,
    documentImageFront: null,
    documentImageBack: null,
    proofOfIncome: null,
    email: undefined,
    document_type: undefined,
    document: undefined,
    phone: undefined,
    role: Roles.USER_CLIENT,
    password: "",
  });

  const [credit, setCredit] = useState({
    requestedAmount: 0,
    yearsOfPayment: 0,
    period: "0",
  });

  const forCreditoref = useRef<HTMLFormElement>(null);
  const forFinancingref = useRef<HTMLFormElement>(null);

  const [financing, setFinancing] = useState({
    vehiclePlate: "",
    vehiclePrice: 0,
    vehicleVIN: "",
    vehicleDescription: "",
    downPayment: 0,
    yearsOfPayment: 0,
    period: "0",
  });

  const handleFileInputChange = (e: any) => {
    const { name, files } = e.target;
    setUser((prevUser: any) => ({ ...prevUser, [name]: files[0] }));
  };

  const handleUserChange = (e: any) => {
    const { name, value } = e.target;
    setUser((prevUser: any) => ({ ...prevUser, [name]: value }));
  };

  const handleCreditChange = (e: any) => {
    const { name, value } = e.target;
    setCredit((prevCredit) => ({ ...prevCredit, [name]: value }));
  };

  const handleFinancingChange = (e: any) => {
    const { name, value } = e.target;
    setFinancing((prevFinancing) => ({ ...prevFinancing, [name]: value }));
  };

  const verifyUserData = (): boolean => {
    if (!user.name) {
      setModalData({
        isOpen: true,
        title: "Error",
        message: "Debes ingresar el nombre del usuario.",
        hasTwoButtons: false,
        button1Text: "Ok",
        button2Text: "",
        closeOnOutsideClick: false,
      })
      return false
    }
    if (!user.age) {
      setModalData({
        isOpen: true,
        title: "Error",
        message: "Debes ingresar la edad del usuario.",
        hasTwoButtons: false,
        button1Text: "Ok",
        button2Text: "",
        closeOnOutsideClick: false,
      })
      return false
    }
    if (!user.locationCroquis) {
      setModalData({
        isOpen: true,
        title: "Error",
        message: "Debes ingresar la ubicación del usuario.",
        hasTwoButtons: false,
        button1Text: "Ok",
        button2Text: "",
        closeOnOutsideClick: false,
      })
      return false
    }
    if (!user.document_type) {
      setModalData({
        isOpen: true,
        title: "Error",
        message: "Debes ingresar el tipo de documento del usuario.",
        hasTwoButtons: false,
        button1Text: "Ok",
        button2Text: "",
        closeOnOutsideClick: false,
      })
      return false
    }
    if (!user.document) {
      setModalData({
        isOpen: true,
        title: "Error",
        message: "Debes ingresar el número de documento del usuario.",
        hasTwoButtons: false,
        button1Text: "Ok",
        button2Text: "",
        closeOnOutsideClick: false,
      })
      return false
    }
    if (!user.phone) {
      setModalData({
        isOpen: true,
        title: "Error",
        message: "Debes ingresar el teléfono del usuario.",
        hasTwoButtons: false,
        button1Text: "Ok",
        button2Text: "",
        closeOnOutsideClick: false,
      })
      return false
    }
    if (!user.email) {
      setModalData({
        isOpen: true,
        title: "Error",
        message: "Debes ingresar el correo del usuario.",
        hasTwoButtons: false,
        button1Text: "Ok",
        button2Text: "",
        closeOnOutsideClick: false,
      })
      return false
    }
    if (!user.proofOfIncome) {
      setModalData({
        isOpen: true,
        title: "Error",
        message: "Debes ingresar la comprobante de ingresos del usuario.",
        hasTwoButtons: false,
        button1Text: "Ok",
        button2Text: "",
        closeOnOutsideClick: false,
      })
      return false
    }
    return true;
  };

  const uploadFiles = async (userToSend: any) => {

    // upload files
    if (userToSend.proofOfIncome) {
      const originalFile = userToSend.proofOfIncome as File;
      const renamedFile = new File([originalFile], `${userToSend.document}_${originalFile.name}`, {
        type: originalFile.type,
        lastModified: originalFile.lastModified,
      });
      const fileSaved = await uploadFile(renamedFile);
      if (fileSaved) {
        userToSend.proofOfIncome = fileSaved.filePath;
      } else {
        userToSend.proofOfIncome = "";
      }
    }
    if (userToSend.locationCroquis) {
      const originalFile = userToSend.locationCroquis as File;
      const renamedFile = new File([originalFile], `${userToSend.document}_${originalFile.name}`, {
        type: originalFile.type,
        lastModified: originalFile.lastModified,
      });
      const fileSaved = await uploadFile(renamedFile);
      if (fileSaved) {
        userToSend.locationCroquis = fileSaved.filePath;
      } else {
        userToSend.locationCroquis = "";
      }
    }
    if (userToSend.documentImageFront) {
      const originalFile = userToSend.documentImageFront as File;
      const renamedFile = new File([originalFile], `${userToSend.document}_${originalFile.name}`, {
        type: originalFile.type,
        lastModified: originalFile.lastModified,
      });
      const fileSaved = await uploadFile(renamedFile);
      if (fileSaved) {
        userToSend.documentImageFront = fileSaved.filePath;
      } else {
        userToSend.documentImageFront = "";
      }
    }
    if (userToSend.documentImageBack) {
      const originalFile = userToSend.documentImageBack as File;
      const renamedFile = new File([originalFile], `${userToSend.document}_${originalFile.name}`, {
        type: originalFile.type,
        lastModified: originalFile.lastModified,
      });
      const fileSaved = await uploadFile(renamedFile);
      if (fileSaved) {
        userToSend.documentImageBack = fileSaved.filePath;
      } else {
        userToSend.documentImageBack = "";
      }
    }
  }

  const handleSubmitSolCredito = async (e: any) => {
    e.preventDefault();
    setLoadingRequest(true);

    // verify user data
    const isValid = verifyUserData();
    if (isValid) {

      if (!credit.period || credit.period === "0") {
        setModalData({
          isOpen: true,
          title: "Error",
          message: "Debes ingresar el plazo del crédito.",
          hasTwoButtons: false,
          button1Text: "Ok",
          button2Text: "",
          closeOnOutsideClick: false,
        })
        setLoadingRequest(false);
        return
      }

      if (!credit.requestedAmount || credit.requestedAmount === 0) {
        setModalData({
          isOpen: true,
          title: "Error",
          message: "Debes ingresar el monto solicitado del crédito.",
          hasTwoButtons: false,
          button1Text: "Ok",
          button2Text: "",
          closeOnOutsideClick: false,
        })
        setLoadingRequest(false);
        return
      }

      if (!credit.yearsOfPayment) {
        setModalData({
          isOpen: true,
          title: "Error",
          message: "Debes ingresar los años de pago del crédito.",
          hasTwoButtons: false,
          button1Text: "Ok",
          button2Text: "",
          closeOnOutsideClick: false,
        })
        setLoadingRequest(false);
        return
      }

      const userToSend = {
        ...user,
        password: user.document,
      }

      await uploadFiles(userToSend);

      const res = await CreateUser(userToSend);

      if (!res) {
        await deleteFile(userToSend.proofOfIncome as string);
        await deleteFile(userToSend.locationCroquis as string);
        await deleteFile(userToSend.documentImageFront as string);
        await deleteFile(userToSend.documentImageBack as string);
      }

      await CreateCredit({
        userId: res.content,
        userCreatorId: userInfo.id,
        requestedAmount: credit.requestedAmount,
        interestRate: interestRate,
        yearsOfPayment: credit.yearsOfPayment,
        period: credit.period,
        status: Status.PENDING,
        applicationDate: new Date().toUTCString(),
      });

      setUser({
        name: undefined,
        age: undefined,
        locationCroquis: null,
        documentImageFront: null,
        documentImageBack: null,
        proofOfIncome: null,
        email: undefined,
        document_type: undefined,
        document: undefined,
        phone: undefined,
        password: "",
      })
      setCredit({
        requestedAmount: 0,
        period: "0",
        yearsOfPayment: 0
      })
      forCreditoref.current?.reset();

      setLoadingRequest(false);
      setModalData({
        isOpen: true,
        title: "Solicitud enviada",
        message: "La solicitud ha sido enviada con exito.",
        hasTwoButtons: false,
        button1Text: "Ok",
        button2Text: "",
        closeOnOutsideClick: false,
      })
    } else {
      setLoadingRequest(false);
    }

  };

  const handleSubmitSolFinanciamiento = async (e: any) => {
    e.preventDefault();
    setLoadingRequest(true);

    // verify user data
    const isValid = verifyUserData();
    if (isValid) {

      if (!financing.period || financing.period === "0") {
        setModalData({
          isOpen: true,
          title: "Error",
          message: "Debes ingresar el plazo del financiamiento.",
          hasTwoButtons: false,
          button1Text: "Ok",
          button2Text: "",
          closeOnOutsideClick: false,
        })
        setLoadingRequest(false);
        return
      }

      if (!financing.vehiclePrice || financing.vehiclePrice === 0) {
        setModalData({
          isOpen: true,
          title: "Error",
          message: "Debes ingresar el monto solicitado del financiamiento.",
          hasTwoButtons: false,
          button1Text: "Ok",
          button2Text: "",
          closeOnOutsideClick: false,
        })
        setLoadingRequest(false);
        return
      }

      if (!financing.yearsOfPayment) {
        setModalData({
          isOpen: true,
          title: "Error",
          message: "Debes ingresar los años de pago del financiamiento.",
          hasTwoButtons: false,
          button1Text: "Ok",
          button2Text: "",
          closeOnOutsideClick: false,
        })
        setLoadingRequest(false);
        return
      }

      if (!financing.downPayment) {
        setModalData({
          isOpen: true,
          title: "Error",
          message: "Debes ingresar el pago inicial del financiamiento.",
          hasTwoButtons: false,
          button1Text: "Ok",
          button2Text: "",
          closeOnOutsideClick: false,
        })
        setLoadingRequest(false);
        return
      }

      if (!financing.vehicleDescription) {
        setModalData({
          isOpen: true,
          title: "Error",
          message: "Debes ingresar la descripción del vehículo.",
          hasTwoButtons: false,
          button1Text: "Ok",
          button2Text: "",
          closeOnOutsideClick: false,
        })
        setLoadingRequest(false);
        return
      }

      if (!financing.vehiclePlate) {
        setModalData({
          isOpen: true,
          title: "Error",
          message: "Debes ingresar la placa del vehículo.",
          hasTwoButtons: false,
          button1Text: "Ok",
          button2Text: "",
          closeOnOutsideClick: false,
        })
        setLoadingRequest(false);
        return
      }

      if (!financing.vehicleVIN) {
        setModalData({
          isOpen: true,
          title: "Error",
          message: "Debes ingresar el VIN del vehículo.",
          hasTwoButtons: false,
          button1Text: "Ok",
          button2Text: "",
          closeOnOutsideClick: false,
        })
        setLoadingRequest(false);
        return
      }

      const userToSend = {
        ...user,
        password: user.document,
      }

      await uploadFiles(userToSend);

      const res = await CreateUser(userToSend);

      if (!res) {
        await deleteFile(userToSend.proofOfIncome as string);
        await deleteFile(userToSend.locationCroquis as string);
        await deleteFile(userToSend.documentImageFront as string);
        await deleteFile(userToSend.documentImageBack as string);
      }

      const creditRes = await CreateCredit({
        userId: res.content,
        userCreatorId: userInfo.id,
        requestedAmount: financing.vehiclePrice,
        interestRate: interestRate,
        yearsOfPayment: financing.yearsOfPayment,
        period: financing.period,
        status: Status.PENDING,
        applicationDate: new Date().toUTCString(),
      });

      if (creditRes) {
        await CreateFinancing({
          creditId: creditRes.content,
          vehiclePlate: financing.vehiclePlate,
          vehicleVIN: financing.vehicleVIN,
          vehicleDescription: financing.vehicleDescription,
          downPayment: financing.downPayment
        })
      }

      setUser({
        name: undefined,
        age: undefined,
        locationCroquis: null,
        documentImageFront: null,
        documentImageBack: null,
        proofOfIncome: null,
        email: undefined,
        document_type: undefined,
        document: undefined,
        phone: undefined,
        password: "",
      })
      setFinancing({
        vehiclePrice: 0,
        yearsOfPayment: 0,
        period: "0",
        downPayment: 0,
        vehicleDescription: "",
        vehiclePlate: "",
        vehicleVIN: "",
      })
      forCreditoref.current?.reset();

      setLoadingRequest(false);

      setModalData({
        isOpen: true,
        title: "Solicitud enviada",
        message: "La solicitud de financiamiento ha sido enviada con éxito.",
        hasTwoButtons: false,
        button1Text: "Ok",
        button2Text: "",
        closeOnOutsideClick: false,
      })
    } else {
      setLoadingRequest(false);
    }


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

  const handleApprove = (id: number) => {
    console.log(`Solicitud ${id} aprobada`);
  };

  const handleReject = (id: number) => {
    console.log(`Solicitud ${id} rechazada`);
  };

  const rowkeys = [
    "id",
    "requestedAmount",
    "interestRate",
    "status",
    "numberOfPayments",
  ]


  const columnas = [
    "ID",
    "Monto Solicitado",
    "Tasa de Interés",
    "Estado",
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
    background: "#3f649ef4",
    color: theme === "dark" ? "#fff" : "#000",
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
    // only admins can approve or reject
    actions: hasPermision(userInfo?.role, Roles.USER_ADMIN) ? [
      {
        label: "Aprobar",
        icon: <FaCheck />,
        onClick: () => handleApprove(fila["id"]),
        background: "#5cff67",
        color: theme === "dark" ? "#fff" : "#000",
      },
      {
        label: "Rechazar",
        icon: <FaTimes />,
        onClick: () => handleReject(fila["id"]),
        background: "#ff5c64",
        color: theme === "dark" ? "#fff" : "#000",
      },
    ] : [],
    id: fila["id"].toString(),
  }))










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










      <div id="sol_credito" className={"tabcontent " + theme}>
        <h3>Añadir solicitud de Crédito</h3>

        <form ref={forCreditoref} onSubmit={handleSubmitSolCredito} className={theme} >
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
              name="age"
              value={user.age}
              onChange={handleUserChange}
              required
            />
          </div>
          <div>
            <label>Ubicacion (croquis):</label>
            <input
              type="file"
              name="locationCroquis"
              required
              accept="image/*"
              onChange={handleFileInputChange}
            />
          </div>
          <div>
            <label>Documento (cara de frente):</label>
            <input
              type="file"
              name="documentImageFront"
              required
              accept="image/*"
              onChange={handleFileInputChange}
            />
          </div>
          <div>
            <label>Documento (cara de atras):</label>
            <input
              type="file"
              name="documentImageBack"
              required
              accept="image/*"
              onChange={handleFileInputChange}
            />
          </div>
          <div>
            <label>Constancia de ingresos:</label>
            <input
              type="file"
              name="proofOfIncome"
              required
              onChange={handleFileInputChange}
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
              value={interestRate}
              disabled
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
            <select onChange={handleCreditChange} name="period"  >
              <option value="0">Seleccione una periodicidad de pago</option>
              <option value="12">Mensual</option>
              <option value="48">Semanal</option>
              <option value="24">Quincenal</option>
            </select>
          </div>
          <div>
            <label>Número de cuotas:</label>
            <input
              type="number"
              disabled
              name="numberOfPayments"
              value={credit.yearsOfPayment * parseInt(credit.period)}
            />
          </div>

          <button type="submit">Enviar solicitud</button>
        </form>
      </div>










      <div id="sol_financiamiento" className={"tabcontent " + theme}>
        <h3>Añadir solicitud de Financiamiento</h3>

        <form ref={forFinancingref} onSubmit={handleSubmitSolFinanciamiento} className={theme} >
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
              name="age"
              value={user.age}
              onChange={handleUserChange}
              required
            />
          </div>
          <div>
            <label>Ubicacion (croquis):</label>
            <input
              type="file"
              name="locationCroquis"
              required
              accept="image/*"
              onChange={handleFileInputChange}
            />
          </div>
          <div>
            <label>Documento (cara de frente):</label>
            <input
              type="file"
              name="documentImageFront"
              required
              accept="image/*"
              onChange={handleFileInputChange}
            />
          </div>
          <div>
            <label>Documento (cara de atras):</label>
            <input
              type="file"
              name="documentImageBack"
              required
              accept="image/*"
              onChange={handleFileInputChange}
            />
          </div>
          <div>
            <label>Constancia de ingresos:</label>
            <input
              type="file"
              name="proofOfIncome"
              required
              onChange={handleFileInputChange}
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
            <label>Vehiculo Solicitado (VIN):</label>
            <input
              type="text"
              name="vehicleVIN"
              value={financing.vehicleVIN}
              onChange={handleFinancingChange}
              required
            />
          </div>
          <div>
            <label>Placa del vehiculo:</label>
            <input
              type="text"
              name="vehiclePlate"
              value={financing.vehiclePlate}
              onChange={handleFinancingChange}
              required
            />
          </div>
          <div>
            <label>Descripción del vehiculo:</label>
            <textarea
              name="vehicleDescription"
              value={financing.vehicleDescription}
              onChange={handleFinancingChange}
              required
            />
          </div>
          <div>
            <label>Valor del vehículo:</label>
            <input
              type="number"
              name="vehiclePrice"
              value={financing.vehiclePrice}
              onChange={handleFinancingChange}
              required
            />
          </div>
          <div>
            <label>Tasa de interés (%):</label>
            <input
              type="number"
              name="interestRate"
              value={interestRate}
              disabled
              required
            />
          </div>
          <div>
            <label>Tiempo de pago (años):</label>
            <input
              type="number"
              name="yearsOfPayment"
              value={financing.yearsOfPayment}
              onChange={handleFinancingChange}
              required
            />
          </div>
          <div>
            <label>Cuota inicial:</label>
            <input
              type="number"
              name="downPayment"
              value={financing.downPayment}
              onChange={handleFinancingChange}
              required
            />
          </div>
          <div>
            <label>Forma de pago:</label>
            <select onChange={handleFinancingChange} name="period"  >
              <option value="0">Seleccione una periodicidad de pago</option>
              <option value="12">Mensual</option>
              <option value="48">Semanal</option>
              <option value="24">Quincenal</option>
            </select>
          </div>
          <div>
            <label>Número de cuotas:</label>
            <input
              type="number"
              disabled
              name="numberOfPayments"
              value={financing.yearsOfPayment * parseInt(financing.period)}
            />
          </div>
          <button type="submit">Enviar solicitud</button>
        </form>
      </div>










      <div id="admin_solicitudes" className={"tabcontent " + theme}>
        <h3>Lista de Solicitudes</h3>

        <TableContextProvider>
          <TableContainer
            headers={headers}
            rows={rows}
            isSticky={true}
            maxHeight="60vh"
            // indexed={true}
            loading={false}
            loader={<div style={
              {
                padding: "20px",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }
            }>
              <Loader size="40px" />
            </div>
            }
            roundedCorners={true}
          />
        </TableContextProvider>
      </div>
    </Layout>
  );
};

export default Solicitudes;
