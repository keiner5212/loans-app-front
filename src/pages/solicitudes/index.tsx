import { FC, useCallback, useEffect, useRef, useState } from "react";
import { Layout } from "@/components/Layout";
import "@/components/tabs/tabs.css";
import "./solicitudes.css";
import { FaCheck, FaEye, FaMoneyBill, FaTable, FaTimes, FaTrash } from "react-icons/fa";
import { openContent } from "@/components/tabs";
import { useAppStore } from "@/store/appStore";
import { TableContextProvider } from "@/components/Table/TableService";
import { TableContainer } from "@/components/Table/TableContainer";
import { TableContentIndvidual, TableHeaderType, TableRowType } from "@/components/Table/TableTypes";
import { hasPermision } from "@/utils/security/Permisions";
import { Roles } from "@/constants/permisions/Roles";
import { Loader } from "@/components/Loader";
import { getConfig } from "@/api/config/GetConfig";
import { Config } from "@/constants/config/Config";
import SimpleModal from "@/components/modal/simpleModal/ModalSimple";
import { uploadFile } from "@/api/files/UploadFile";
import { CreateUser } from "@/api/user/CreateUser";
import LoaderModal from "@/components/modal/Loader/LoaderModal";
import { deleteFile } from "@/api/files/DeleteFiles";
import { CreateCredit, CreateFinancing } from "@/api/credit/CreateCredit";
import { CreditType, Status } from "@/constants/credits/Credit";
import { FilterPortal } from "./FilterPortal";
import { GetCredit, GetCredits } from "@/api/credit/GetCredits";
import { formatUtcToLocal } from "@/utils/formats/Dates";
import { AproveCredit, CancelCredit, DeclineCredit } from "@/api/credit/ChangeStatus";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import { FiRefreshCw } from "react-icons/fi";
import { convertMonthlyRate, CreditPeriodObjectValues } from "@/utils/formats/Credits";
import { searchUser } from "@/api/user/userData";
import { AmortizationRow, calcularPago, calcularTabla } from "@/utils/amortizacion/Credit";
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import CustomCheckbox from "@/components/check";
import TextModal from "@/components/modal/TextModal";
import { useNavigationContext } from "@/contexts/NavigationContext";
import { getFile } from "@/api/files/GetFiles";

const rowkeys = [
  "id",
  "userId",
  "approvedAmount",
  "lateInterest",
  "remainingDebt",
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
  "Monto Aprovado",
  "Interés de retraso",
  "Deuda Restante",
  "Tipo de credito",
  "ID del creador",
  "Monto solicitado",
  "Tasa de interes",
  "Cantidad de años",
  "Periodo",
  "Estado",
  "Fecha de solicitud"
];

const Solicitudes: FC = () => {
  const [loadingRequest, setLoadingRequest] = useState(false);
  const [search, setSearch] = useState("");
  const [solicitudes, setSolicitudes] = useState<any[]>([]);
  const [solicitudesBack, setSolicitudesBack] = useState<any[]>([]);
  const [rows, setRows] = useState<TableRowType[]>([]);
  const [showFilterBox, setShowFilterBox] = useState(false);
  const { lastPage, setLastPage } = useNavigationContext();
  const [selectedFilter, setSelectedFilter] = useState({
    type: "",
    status: "",
  });

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

  const [textModalData, setTextModalData] = useState({
    isOpen: false,
    title: "",
    message: "",
    isTextArea: false,
    placeholder: "",
    button1Text: "",
    button1Action: (_text: string) => { },
    button2Text: "",
    button2Action: () => { },
  })

  const defaultTabRef = useRef<HTMLButtonElement>(null);
  const { theme, userInfo } = useAppStore();
  const [interestRate, setInterestRate] = useState(0);
  const [maxCreditAmountRes, setMaxCreditAmountRes] = useState(0);
  const [minCreditAmountRes, setMinCreditAmountRes] = useState(0);
  const [isOldUser, setIsOldUser] = useState(false);

  useEffect(() => {
    if (defaultTabRef.current) {
      defaultTabRef.current.click();
    }
    getConfig(Config.INTEREST_RATE).then((res) => setInterestRate(parseFloat(res?.data.value) * 100));

    getConfig(Config.MAX_CREDIT_AMOUNT).then((res) => setMaxCreditAmountRes(parseFloat(res?.data.value)));
    getConfig(Config.MIN_CREDIT_AMOUNT).then((res) => setMinCreditAmountRes(parseFloat(res?.data.value)));
    GetCredits().then((res) => {
      const solicitudesRes = res.data.map((creditres: any) => {

        return {
          ...creditres,
          remainingDebt: parseFloat((creditres.status == Status.CANCELED ? 0 : creditres.requestedAmount - creditres.approvedAmount).toFixed(2))
        }
      });
      setSolicitudes(solicitudesRes)
      setSolicitudesBack(solicitudesRes)
    });
  }, []);

  useEffect(() => {
    if (lastPage) {
      if (lastPage.startsWith("/details")) {
        if (adminSolicirudesRef.current) {
          adminSolicirudesRef.current.click();
        }
        setLastPage(null);
      }
    }

  }, [lastPage]);

  const [loadingTable, setLoadingTable] = useState(false);
  const handleReloadCredits = useCallback(
    debounce(() => {
      setLoadingTable(true);
      GetCredits().then((res) => {
        const solicitudesRes = res.data.map((creditres: any) => {

          return {
            ...creditres,
            remainingDebt: parseFloat((creditres.status == Status.CANCELED ? 0 : creditres.requestedAmount - creditres.approvedAmount).toFixed(2))
          }
        });
        setSolicitudes(solicitudesRes)
        setSolicitudesBack(solicitudesRes)
        setLoadingTable(false);
      })
    }, 300), // 300 ms de espera antes de ejecutar la función (evitar spamming de peticiones)
    []
  );

  useEffect(() => {
    let actualList = solicitudesBack
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
    setSolicitudes(actualList);
  }, [selectedFilter, search]);


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

    //this is enough for old users
    if (isOldUser) return true;

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
    let userExistentEmail = null;
    const userExistentDocument = await searchUser(user.document);
    if (!userExistentDocument.user) {
      userExistentEmail = await searchUser(user.email);
    }
    if ((userExistentDocument.user || userExistentEmail.user) && !isOldUser) {
      setModalData({
        isOpen: true,
        title: "Error",
        message: "Ya existe un usuario con el número de documento o correo ingresado, se reutilizará su información.",
        hasTwoButtons: false,
        button1Text: "Ok",
        button2Text: "",
        closeOnOutsideClick: false,
      })
    }

    let ExistentUser = null;
    if (userExistentDocument.user) {
      ExistentUser = userExistentDocument.user;
    } else if (userExistentEmail.user) {
      ExistentUser = userExistentEmail.user;
    }

    // verify credit data
    if (minCreditAmountRes != 0) {
      if (credit.requestedAmount < minCreditAmountRes) {
        setModalData({
          isOpen: true,
          title: "Error",
          message: `El monto solicitado debe ser mayor a ${minCreditAmountRes}.`,
          hasTwoButtons: false,
          button1Text: "Ok",
          button2Text: "",
          closeOnOutsideClick: false,
        })
      }
    }

    if (maxCreditAmountRes != 0) {
      if (credit.requestedAmount > maxCreditAmountRes) {
        setModalData({
          isOpen: true,
          title: "Error",
          message: `El monto solicitado debe ser menor a ${maxCreditAmountRes}.`,
          hasTwoButtons: false,
          button1Text: "Ok",
          button2Text: "",
          closeOnOutsideClick: false,
        })
      }
    }

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

      let resId = null;

      if (ExistentUser) {
        resId = ExistentUser.id;
      } else {
        const userToSend = {
          ...user,
          password: user.document, // use document as password
        }


        await uploadFiles(userToSend);

        const res = await CreateUser(userToSend);

        if (!res) {
          await deleteFile(userToSend.proofOfIncome as string);
          await deleteFile(userToSend.locationCroquis as string);
          await deleteFile(userToSend.documentImageFront as string);
          await deleteFile(userToSend.documentImageBack as string);
        } else {
          resId = res.content
        }

      }

      await CreateCredit({
        userId: resId,
        userCreatorId: userInfo.id,
        requestedAmount: credit.requestedAmount,
        interestRate: interestRate,
        yearsOfPayment: credit.yearsOfPayment,
        period: credit.period,
        status: Status.PENDING,
        applicationDate: new Date().toUTCString(),
        creditType: CreditType.CREDIT,
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
      forFinancingref.current?.reset();
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
    let userExistentEmail = null;
    const userExistentDocument = await searchUser(user.document);
    if (!userExistentDocument.user) {
      userExistentEmail = await searchUser(user.email);
    }
    if ((userExistentDocument.user || userExistentEmail.user) && !isOldUser) {
      setModalData({
        isOpen: true,
        title: "Error",
        message: "Ya existe un usuario con el número de documento o correo ingresado, se reutilizará su información.",
        hasTwoButtons: false,
        button1Text: "Ok",
        button2Text: "",
        closeOnOutsideClick: false,
      })
    }

    let ExistentUser = null;
    if (userExistentDocument.user) {
      ExistentUser = userExistentDocument.user;
    } else if (userExistentEmail.user) {
      ExistentUser = userExistentEmail.user;
    }

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

      let resId = null;

      if (ExistentUser) {
        resId = ExistentUser.id;
      } else {

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
          setLoadingRequest(false);
          setModalData({
            isOpen: true,
            title: "Error",
            message: "Error al crear el usuario.",
            hasTwoButtons: false,
            button1Text: "Ok",
            button2Text: "",
            closeOnOutsideClick: false,
          })
          return
        } else {
          resId = res.content
        }

      }

      const creditRes = await CreateCredit({
        userId: resId,
        userCreatorId: userInfo.id,
        requestedAmount: financing.vehiclePrice,
        interestRate: interestRate,
        yearsOfPayment: financing.yearsOfPayment,
        period: financing.period,
        status: Status.PENDING,
        applicationDate: new Date().toUTCString(),
        creditType: CreditType.FINANCING,
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
      forFinancingref.current?.reset();
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

  const exportExcel = async (amortizacion: AmortizationRow[], totales: { totalPagado: number; totalIntereses: number; totalAmortizado: number }) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Amortización');

    interface ConfigResponse {
      data: {
        value: string;
      };
    }
    // Fetch company information
    const [logoRes, documentNameRes, companyRegistrationRes, companyAddressRes, companyPhoneRes, companyEmailRes]: ConfigResponse[] =
      await Promise.all([
        getConfig(Config.DOCUMENT_LOGO),
        getConfig(Config.DOCUMENT_NAME),
        getConfig(Config.COMPANY_REGISTRATION),
        getConfig(Config.COMPANY_ADDRESS),
        getConfig(Config.COMPANY_PHONE),
        getConfig(Config.COMPANY_EMAIL)
      ]);

    // Set up logo
    let logoUrl = "https://th.bing.com/th/id/OIP.LmjRjBonaZtB0o-oo3CuNgAAAA?w=350&h=247&rs=1&pid=ImgDetMain";
    if (logoRes) {
      const fileResponse = await getFile(logoRes.data.value);
      logoUrl = URL.createObjectURL(fileResponse);
    }

    // Add logo to Excel file
    const logoImage = await fetch(logoUrl)
      .then((res) => res.arrayBuffer())
      .then((arrayBuffer) => new Uint8Array(arrayBuffer));

    const logoId = workbook.addImage({
      buffer: logoImage,
      extension: 'png',
    });

    // Adjust row and column sizes

    // fila vacía
    worksheet.getRow(1).height = 10;
    // columna vacía
    worksheet.getColumn(1).width = 5;

    worksheet.getRow(2).height = 70; // Logo
    worksheet.getRow(3).height = 20; // Document name
    worksheet.getRow(4).height = 20; // Company registration
    worksheet.getRow(5).height = 20; // Address
    worksheet.getRow(6).height = 20; // Phone
    worksheet.getRow(7).height = 20; // Email

    // Add logo
    worksheet.mergeCells('B2:C2'); // logo
    worksheet.mergeCells('D2:F2'); // Nombre del documento
    worksheet.addImage(logoId, {
      tl: { col: 1, row: 1 }, 
      ext: { width: 210, height: 93.5 },
    });

    // Add document name
    worksheet.getCell('D2').value = "Tabla de Amortización";
    //estilo de la celda
    worksheet.getCell('D2').font = { bold: true, size: 16 };
    //bordes
    worksheet.getCell('B2').border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    }
    worksheet.getCell('D2').border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    }
    //alineacion
    worksheet.getCell('B2').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('D2').alignment = { vertical: 'middle', horizontal: 'center' };


    // Add company information
    const headerInfo: Array<{ cell: string; value: string; font: Partial<ExcelJS.Font> }> = [
      { cell: 'B3', value: "Empresa: ", font: { bold: true, size: 16 } },
      { cell: 'D3', value: documentNameRes?.data.value || 'Nombre de Documento', font: { size: 16 } },
      { cell: 'B4', value: "RTN: ", font: { bold: true, size: 12 } },
      { cell: 'D4', value: companyRegistrationRes?.data.value || 'Registro de Documento', font: { size: 10 } },
      { cell: 'B5', value: "Dirección: ", font: { bold: true, size: 12 } },
      { cell: 'D5', value: companyAddressRes?.data.value || 'Dirección de Documento', font: { size: 10 } },
      { cell: 'B6', value: "Teléfono: ", font: { bold: true, size: 12 } },
      { cell: 'D6', value: companyPhoneRes?.data.value || 'Teléfono de Documento', font: { size: 10 } },
      { cell: 'B7', value: "Email: ", font: { bold: true, size: 12 } },
      { cell: 'D7', value: companyEmailRes?.data.value || 'Email de Documento', font: { size: 10 } },
    ];

    headerInfo.forEach(({ cell, value, font }) => {
      if (cell.startsWith("B")) worksheet.mergeCells(`${cell}:C${cell.charAt(1)}`);
      if (cell.startsWith("D")) worksheet.mergeCells(`${cell}:F${cell.charAt(1)}`);
      const wsCell = worksheet.getCell(cell);
      wsCell.value = value;
      wsCell.font = font;
      wsCell.alignment = { vertical: 'middle', horizontal: 'center' };
      wsCell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    // Set up amortization table
    const tableStartRow = 9;
    worksheet.getRow(tableStartRow).values = ["", 'Periodo', 'Pago', 'Intereses', 'Amortización', 'Deuda Restante'];
    worksheet.getRow(tableStartRow).font = { bold: true };
    worksheet.getRow(tableStartRow).alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.columns = [
      { key: '', width: 5 },
      { key: 'periodo', width: 10 },
      { key: 'pago', width: 20 },
      { key: 'intereses', width: 20 },
      { key: 'amortizacion', width: 20 },
      { key: 'deudaRestante', width: 20 },
    ];

    // Add amortization data
    amortizacion.forEach((dato) => {
      const row = worksheet.addRow({
        periodo: dato.periodo,
        pago: parseFloat(dato.pago.toFixed(3)),
        intereses: parseFloat(dato.intereses.toFixed(3)),
        amortizacion: parseFloat(dato.amortizacion.toFixed(3)),
        deudaRestante: parseFloat(dato.deudaRestante.toFixed(3)),
      });
      row.alignment = { vertical: 'middle', horizontal: 'center' };
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
    });

    // Add totals row
    const totalRow = worksheet.addRow({
      '': '',
      periodo: 'Totales',
      pago: parseFloat(totales.totalPagado.toFixed(3)),
      intereses: parseFloat(totales.totalIntereses.toFixed(3)),
      amortizacion: parseFloat(totales.totalAmortizado.toFixed(3)),
      deudaRestante: '-',
    });

    totalRow.font = { bold: true };
    totalRow.alignment = { vertical: 'middle', horizontal: 'center' };
    totalRow.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    // Generate and save Excel file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    saveAs(blob, 'Tabla_Amortizacion.xlsx');
  };


  const handleGenerateAmortization = async (id: any) => {
    setLoadingRequest(true);
    if (id) {
      GetCredit(Number(id))
        .then((response) => {
          const foundCredit = response.data.credit
          const foundFinancing = response.data.financing

          const { tabla, totalPagado, totalIntereses, totalAmortizado } = calcularTabla(
            foundCredit.interestRate / 100,
            foundCredit.requestedAmount,
            foundFinancing ? foundFinancing.downPayment : 0,
            foundCredit.yearsOfPayment * foundCredit.period,
            foundCredit.period
          )


          exportExcel(tabla, { totalPagado, totalIntereses, totalAmortizado });
        })
        .catch((error) => {
          console.error("Error fetching credit:", error);
        })
        .finally(() => {
          setLoadingRequest(false);
        });
    }
  }

  function restartTextModal() {
    setTextModalData({
      isOpen: false,
      title: "",
      message: "",
      isTextArea: false,
      placeholder: "",
      button1Text: "",
      button1Action: (_text: string) => { },
      button2Text: "",
      button2Action: () => { },
    });
  }

  const [modalText, setModalText] = useState("");

  function handleAnular(id: number): void {
    setTextModalData({
      isOpen: true,
      title: "Anular solicitud",
      message: "¿Estás seguro de anular la solicitud?",
      isTextArea: true,
      placeholder: "Anular solicitud",
      button1Text: "Si",
      button2Text: "No",
      button1Action: (text: string) => {
        CancelCredit(id, text).then(() => {
          restartTextModal();
        })
      },
      button2Action: restartTextModal,
    })
  }

  const handleApprove = (id: number) => {
    setLoadingRequest(true);
    AproveCredit(id).then(() => {
      let edited: any = solicitudes.find((solicitud: any) => solicitud.id === id);
      if (edited) {
        edited.status = Status.APPROVED
        const filteredSolicitudes: any[] = solicitudes.filter((solicitud: any) => solicitud.id !== id);
        setSolicitudes([...filteredSolicitudes, edited]);
        const filteredSolicitudesBack: any[] = solicitudesBack.filter((solicitud: any) => solicitud.id !== id);
        setSolicitudesBack([...filteredSolicitudesBack, edited]);
      }
      setLoadingRequest(false)
    });
  };

  const handleReject = (id: number) => {
    setLoadingRequest(true);
    DeclineCredit(id).then(() => {
      let edited: any = solicitudes.find((solicitud: any) => solicitud.id === id);
      if (edited) {
        edited.status = Status.REJECTED
        const filteredSolicitudes: any[] = solicitudes.filter((solicitud: any) => solicitud.id !== id);
        setSolicitudes([...filteredSolicitudes, edited]);
        const filteredSolicitudesBack: any[] = solicitudesBack.filter((solicitud: any) => solicitud.id !== id);
        setSolicitudesBack([...filteredSolicitudesBack, edited]);
      }
      setLoadingRequest(false)
    });
  };

  const navigate = useNavigate();

  const handleMoreInfo = (id: string) => {
    navigate(`/solicitudes/${id}`);
  }

  const handleDesembolso = (id: string) => {
    navigate(`/solicitudes/${id}/desembolse`);
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

  useEffect(() => {
    if (!solicitudes) return
    setRows(
      solicitudes.map((fila: { [x: string]: any }) => {
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
              tooltip: fila[`${columna}`]?.toString(),
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
            ...(hasPermision(userInfo?.role, Roles.USER_ADMIN) &&
              fila["status"] === Status.PENDING) ? [
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
            {
              label: "Ver detalles",
              icon: <FaEye />,
              onClick: () => handleMoreInfo(fila["id"]),
              background: "#3f649ef4",
              color: theme === "dark" ? "#fff" : "#000",
            },
            ...(fila["status"] === Status.APPROVED) ? [
              {
                label: "Desembolsar",
                icon: <FaMoneyBill />,
                onClick: () => handleDesembolso(fila["id"]),
                background: "#3f649ef4",
                color: theme === "dark" ? "#fff" : "#000",
              }
            ] : [],
            ...(fila["status"] === Status.RELEASED || fila["status"] === Status.FINISHED || fila["status"] === Status.LATE) ? [
              {
                label: "Generar tabla de amortizaciones",
                icon: <FaTable size={30} />,
                onClick: () => handleGenerateAmortization(fila["id"]),
                background: "#3f649ef4",
                color: theme === "dark" ? "#fff" : "#000",
              }
            ] : [],
            ...(fila["status"] === Status.RELEASED || fila["status"] === Status.LATE) ? [
              {
                label: "Anular solicitud",
                icon: <FaTrash />,
                onClick: () => handleAnular(fila["id"]),
                background: "#ff5c64",
                color: theme === "dark" ? "#fff" : "#000",
              }
            ] : [],
          ],
          id: fila["id"].toString(),
        }
        return temp
      })
    )
  }, [solicitudes]);

  const adminSolicirudesRef = useRef<HTMLButtonElement>(null);



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
      <TextModal
        isOpen={textModalData.isOpen}
        title={textModalData.title}
        message={textModalData.message}
        isTextArea={textModalData.isTextArea}
        placeholder={textModalData.placeholder}
        value={modalText}
        onChange={(e) => {
          setModalText(e.target.value);
        }}
        button1Text={textModalData.button1Text}
        button1Action={textModalData.button1Action}
        button2Text={textModalData.button2Text}
        button2Action={textModalData.button2Action}
        closeOnOutsideClick={false}
        onClose={restartTextModal}
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
          ref={adminSolicirudesRef}
          onClick={(event) => openContent(event, "admin_solicitudes")}
        >
          Administrar solicitudes
        </button>
      </div>










      <div id="sol_credito" className={"tabcontent " + theme}>
        <h3>Añadir solicitud de Crédito</h3>

        <form ref={forCreditoref} onSubmit={handleSubmitSolCredito} className={theme} >
          <h4 id="user-data-sub">Datos de usuario</h4>
          <div className="checker-contain">
            <CustomCheckbox label="Es un usuario antiguo" onChange={(checked) => setIsOldUser(checked)} value={isOldUser} />
          </div>
          {isOldUser ?
            <>
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
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleUserChange}
                  required
                />
              </div>
            </>
            :
            <>
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

            </>}

          <h4 id="request-data-sub" className={isOldUser ? "oldUser" : ""}>Datos de solicitud</h4>
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
            <label>Tasa de interés (% Efectivo Mensual):</label>
            <input
              type="number"
              name="interestRate"
              value={interestRate}
              onChange={(e) => setInterestRate(parseFloat(e.target.value))}
              required
            />
          </div>
          <div>
            <label>Pago en cada periodo:</label>
            <input
              type="number"
              name="periodlyPayment"
              value={calcularPago(interestRate / 100, credit.requestedAmount, 0,
                credit.yearsOfPayment * parseInt(credit.period), parseInt(credit.period))}
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
            <label>Forma de pago {credit.period != "0" ?
              "(Tasa = " + 100 * convertMonthlyRate(interestRate / 100, parseInt(credit.period)) + "%)" : ""}:</label>
            <select onChange={handleCreditChange} name="period"  >
              <option value="0">Seleccione una periodicidad de pago</option>
              {Object.keys(CreditPeriodObjectValues).map((period: string, index) => (
                <option key={index} value={CreditPeriodObjectValues[period]}>
                  {period}
                </option>
              ))}
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

          <div className="checker-contain">
            <CustomCheckbox label="Es un usuario antiguo" onChange={(checked) => setIsOldUser(checked)} value={isOldUser} />
          </div>
          {isOldUser ?
            <>
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
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleUserChange}
                  required
                />
              </div>
            </>
            :
            <>
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

            </>}

          <h4 id="request-data-sub" className={isOldUser ? "oldUser" : ""}>Datos de solicitud</h4>
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
            <label>Tasa de interés (% Efectivo Mensual):</label>
            <input
              type="number"
              name="interestRate"
              value={interestRate}
              onChange={(e) => setInterestRate(parseFloat(e.target.value))}
              required
            />
          </div>
          <div>
            <label>Pago en cada periodo:</label>
            <input
              type="number"
              name="periodlyPayment"
              value={calcularPago(interestRate / 100, financing.vehiclePrice,
                financing.downPayment,
                financing.yearsOfPayment * parseInt(financing.period), parseInt(financing.period))}
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
            <label>Forma de pago {financing.period != "0" ?
              "(Tasa = " + convertMonthlyRate(interestRate / 100, parseInt(financing.period)) + "%)" : ""}:</label>
            <select onChange={handleFinancingChange} name="period"  >
              <option value="0">Seleccione una periodicidad de pago</option>
              {Object.keys(CreditPeriodObjectValues).map((period: string, index) => (
                <option key={index} value={CreditPeriodObjectValues[period]}>
                  {period}
                </option>
              ))}
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
    </Layout>
  );
};

export default Solicitudes;