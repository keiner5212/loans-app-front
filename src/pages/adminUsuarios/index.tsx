import { FC, useCallback, useEffect, useRef, useState } from "react";
import { Layout } from "../../components/Layout";
import "../../components/tabs/tabs.css";
import { openContent } from "../../components/tabs";
import "./admin_usuarios.css"
import { Roles } from "../../constants/permisions/Roles";
import { getUsers } from "../../api/user/userData";
import { TableContentIndvidual, TableHeaderType, TableRowType } from "../../components/Table/TableTypes";
import { useAppStore } from "../../store/appStore";
import { formatUtcToLocal } from "../../utils/date/formatToLocal";
import { FaEye, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { TableContextProvider } from "../../components/Table/TableService";
import { TableContainer } from "../../components/Table/TableContainer";
import { FiRefreshCw } from "react-icons/fi";
import { FilterPortal } from "./RoleFilterPortal";
import { debounce } from "lodash";
import { Loader } from "../../components/Loader";
import SimpleModal from "../../components/modal/simpleModal/ModalSimple";
import LoaderModal from "../../components/modal/Loader/LoaderModal";
import "../solicitudes/solicitudes.css";
import { DeleteUser } from "../../api/user/DeleteUser";
import { deleteFile } from "../../api/files/DeleteFiles";
import { CreateUser } from "../../api/user/CreateUser";
import { uploadFile } from "../../api/files/UploadFile";

export interface Usuario {
  id: number;
  name: string;
  age: number | null;
  locationCroquis: string | null;
  documentImageFront: string | null;
  documentImageBack: string | null;
  proofOfIncome: string | null;
  email: string;
  document_type: "CC" | "TI" | "CE" | string;
  document: string;
  phone: string;
  role: Roles | string;
  password: string;
  created_at: string; // ISO 8601 date string
}

const columnas = [
  "ID",                     // id del usuario
  "Nombre",                 // name del usuario
  "Edad",                   // age del usuario
  "Correo Electrónico",    // email del usuario
  "Tipo de Documento",     // document_type del usuario
  "Documento",             // document del usuario
  "Teléfono",              // phone del usuario
  "Rol",                   // role del usuario
  "Fecha de Creación"      // created_at del usuario
];


const AdministrarUsuarios: FC = () => {
  const defaultTabRef = useRef<HTMLButtonElement>(null);
  const { theme, userInfo } = useAppStore();
  const [rows, setRows] = useState<TableRowType[]>([]);

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuariosBackup, setUsuariosBackup] = useState<Usuario[]>([]);
  const [search, setSearch] = useState("");

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
  const [selectedFilter, setSelectedFilter] = useState({
    role: "",
  });
  const [showFilterBox, setShowFilterBox] = useState(false);

  const toggleFilterBox = () => {
    setShowFilterBox(!showFilterBox);
  };
  const [repeatPassword, setRepeatPassword] = useState("");

  const handleFilterChange = (e: any) => {
    const { name, value } = e.target;
    setSelectedFilter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const [loadingTable, setLoadingTable] = useState(false);
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
  const [loadingRequest, setLoadingRequest] = useState(false);
  const [modalData, setModalData] = useState({
    isOpen: false,
    title: "",
    message: "",
    hasTwoButtons: false,
    button1Text: "",
    button2Text: "",
    closeOnOutsideClick: false,
  });

  const handleFileInputChange = (e: any) => {
    const { name, files } = e.target;
    setUser((prevUser: any) => ({ ...prevUser, [name]: files[0] }));
  };

  const handleUserChange = (e: any) => {
    const { name, value } = e.target;
    setUser((prevUser: any) => ({ ...prevUser, [name]: value }));
  };
  const handleReloadUsers = useCallback(
    debounce(() => {
      setLoadingTable(true);
      getUsers().then((res) => {
        setUsuarios(res);
        setUsuariosBackup(res);
        setLoadingTable(false);
      })
    }, 300), // 300 ms de espera antes de ejecutar la función (evitar spamming de peticiones)
    []
  );
  useEffect(() => {
    let actualList = usuariosBackup
    if (selectedFilter.role && selectedFilter.role !== "") {
      actualList = actualList.filter((usuario: Usuario) => usuario.role == selectedFilter.role);
    }
    if (search && search !== "") {
      actualList = actualList.filter((usuario: Usuario) =>
        JSON.stringify(usuario).toLowerCase().includes(search.toLowerCase())
      );
    }
    setUsuarios(actualList);
  }, [selectedFilter, search]);

  useEffect(() => {
    if (defaultTabRef.current) {
      defaultTabRef.current.click();
    }
    async function getUsersData() {
      await getUsers().then((res) => {
        setUsuarios(res);
        setUsuariosBackup(res);
      })
    }
    getUsersData()
  }, []);

  const getUserRow = (user: Usuario) => ([
    {
      content: { Label: user.id, data: user },
      onClick(event: any) {
        console.log(event);
      },
      background: "#fff",
      color: "#000",
      align: "left",
      tooltip: user.id.toString(),
    },
    {
      content: { Label: user.name, data: user },
      onClick(event: any) {
        console.log(event);
      },
      background: "#fff",
      color: "#000",
      align: "left",
      tooltip: user.name.toString(),
    },
    {
      content: { Label: user.age, data: user },
      onClick(event: any) {
        console.log(event);
      },
      background: "#fff",
      color: "#000",
      align: "left",
      tooltip: user.age?.toString(),
    },
    {
      content: { Label: user.email, data: user },
      onClick(event: any) {
        console.log(event);
      },
      background: "#fff",
      color: "#000",
      align: "left",
      tooltip: user.email,
    },
    {
      content: { Label: user.document_type, data: user },
      onClick(event: any) {
        console.log(event);
      },
      background: "#fff",
      color: "#000",
      align: "left",
      tooltip: user.document_type.toString(),
    },
    {
      content: { Label: user.document, data: user },
      onClick(event: any) {
        console.log(event);
      },
      background: "#fff",
      color: "#000",
      align: "left",
      tooltip: user.document.toString(),
    },
    {
      content: { Label: user.phone, data: user },
      onClick(event: any) {
        console.log(event);
      },
      background: "#fff",
      color: "#000",
      align: "left",
      tooltip: user.phone.toString(),
    },
    {
      content: { Label: user.role, data: user },
      onClick(event: any) {
        console.log(event);
      },
      background: "#fff",
      color: "#000",
      align: "left",
      tooltip: user.role.toString(),
    },
    {
      content: {
        Label: formatUtcToLocal(user.created_at, import.meta.env.VITE_LOCALE,
          import.meta.env.VITE_TIMEZONE), data: user
      },
      onClick(event: any) {
        console.log(event);
      },
      background: "#fff",
      color: "#000",
      align: "left",
      tooltip: formatUtcToLocal(user.created_at, import.meta.env.VITE_LOCALE,
        import.meta.env.VITE_TIMEZONE),
    },
  ]
  )
  const navigate = useNavigate();

  const handleMoreInfo = (id: number) => {
    navigate(`/usuarios/${id}`);
  }

  const handleDelete = (id: number) => {
    setLoadingRequest(true);
    if (userInfo.role == Roles.USER_ADMIN
      && usuariosBackup.filter((usuario: Usuario) => usuario.id == id)[0].role == Roles.USER_MASTER
    ) {
      setModalData({
        title: "Error",
        message: "No puedes eliminar un usuario master",
        isOpen: true,
        hasTwoButtons: false,
        closeOnOutsideClick: true,
        button1Text: "Ok",
        button2Text: "",
      })
      setLoadingRequest(false)
    } else {
      DeleteUser(id).then((res) => {
        setLoadingRequest(false);
        if (res) {
          setModalData({
            title: "Éxito",
            message: "El usuario ha sido eliminado exitosamente",
            isOpen: true,
            hasTwoButtons: false,
            closeOnOutsideClick: true,
            button1Text: "Ok",
            button2Text: "",
          })
          setUsuarios(usuarios.filter((usuario: Usuario) => usuario.id != id));
          setUsuariosBackup(usuariosBackup.filter((usuario: Usuario) => usuario.id != id));
        }
      }).catch((err) => {
        console.log(err);
        setLoadingRequest(false);
        setModalData({
          title: "Error",
          message: "Hubo un problema eliminando el usuario",
          isOpen: true,
          hasTwoButtons: false,
          closeOnOutsideClick: true,
          button1Text: "Ok",
          button2Text: "",
        })
      })
    }
  }

  useEffect(() => {
    setRows(
      usuarios.map((fila: Usuario) => {
        const temp: TableRowType = {
          columns: getUserRow(fila) as TableContentIndvidual[],
          hoverEffect: true,
          hoverType: "individual",
          actions: [
            {
              label: "Ver detalles",
              icon: <FaEye />,
              onClick: () => handleMoreInfo(fila.id),
              background: "#3f649ef4",
              color: theme === "dark" ? "#fff" : "#000",
            },
            {
              label: "Eliminar",
              icon: <FaTrash />,
              onClick: () => handleDelete(fila.id),
              background: "#ff5c64",
              color: theme === "dark" ? "#fff" : "#000",
            }
          ],
          id: fila.id.toString(),
        }
        return temp
      })
    )
  }, [usuarios]);

  const formref = useRef<HTMLFormElement>(null);

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

    if (!user.password) {
      setModalData({
        isOpen: true,
        title: "Error",
        message: "Debes ingresar la contraseña del usuario.",
        hasTwoButtons: false,
        button1Text: "Ok",
        button2Text: "",
        closeOnOutsideClick: false,
      })
      return false
    }
    if (user.password.length < 5) {
      setModalData({
        isOpen: true,
        title: "Error",
        message: "La contraseña debe tener al menos 5 caracteres.",
        hasTwoButtons: false,
        button1Text: "Ok",
        button2Text: "",
        closeOnOutsideClick: false,
      })
      return false
    }
    if (repeatPassword != user.password) {
      setModalData({
        isOpen: true,
        title: "Error",
        message: "Las contraseñas no coinciden.",
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

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoadingRequest(true);

    // verify user data
    const isValid = verifyUserData();
    if (isValid) {

      const userToSend = {
        ...user
      }

      await uploadFiles(userToSend);

      const res = await CreateUser(userToSend);

      if (!res) {
        await deleteFile(userToSend.proofOfIncome as string);
        await deleteFile(userToSend.locationCroquis as string);
        await deleteFile(userToSend.documentImageFront as string);
        await deleteFile(userToSend.documentImageBack as string);
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
      formref.current?.reset();
      setLoadingRequest(false);

      setModalData({
        isOpen: true,
        title: "Éxito",
        message: "El usuario ha sido creado con éxito.",
        hasTwoButtons: false,
        button1Text: "Ok",
        button2Text: "",
        closeOnOutsideClick: false,
      })
    } else {
      setLoadingRequest(false);
    }


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
          onClick={(event) => openContent(event, "ver_usuarios")}
        >
          Ver Usuarios
        </button>
        <button
          className="tablinks"
          onClick={(event) => openContent(event, "agregar_usuario")}
        >
          Agregar Usuario
        </button>
      </div>

      {/* Tab: Ver Usuarios */}
      <div id="ver_usuarios" className="tabcontent">
        <h3>Lista de Usuarios</h3>
        <div className="filter-search-container">
          <input
            type="text"
            placeholder="Buscar usuario..."
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="filter-button" onClick={toggleFilterBox}>
            Filtros
          </button>
          <button onClick={handleReloadUsers}>
            <FiRefreshCw />
          </button>
        </div>
        <FilterPortal
          clearFilter={() => setSelectedFilter({
            role: "",
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

      {/* Tab: Agregar Usuario */}
      <div id="agregar_usuario" className="tabcontent">
        <h3>Añadir Usuario</h3>

        <form ref={formref} onSubmit={handleSubmit} className={theme} >
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
            <label>Contraseña:</label>
            <input
              type="password"
              name="password"
              value={user.password}
              onChange={(e) => {
                //verificar contraseña
                const input = e.target;
                const value = input.value;
                if (value.length < 5) {
                  input.setCustomValidity('La contraseña debe tener al menos 5 caracteres');
                }
                else {
                  input.setCustomValidity('');
                }
                setUser({ ...user, password: value });
                handleUserChange(e);
              }}
              required
            />
          </div>
          <div>
            <label>Repetir Contraseña:</label>
            <input
              type="password"
              name="password-repeat"
              value={repeatPassword}
              onChange={(e) => {
                const input = e.target;
                const value = input.value;
                if (value !== user.password) {
                  input.setCustomValidity('Las contraseñas no coinciden');
                } else {
                  input.setCustomValidity('');
                }
                setRepeatPassword(value);
              }}
              required
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
            <label>Rol del usuario:</label>
            <select
              name="role"
              value={user.role}
              onChange={handleUserChange}
              required
            >
              {Object.values(Roles).map((role) => (
                <option key={role} value={role}>
                  {role.replace('USER_', '').replace('_', ' ')}
                </option>
              ))}
            </select>
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
          <button type="submit">Crear usuario</button>
        </form>
      </div>
    </Layout>
  );
};

export default AdministrarUsuarios;
