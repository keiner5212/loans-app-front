import { FC, useEffect, useRef, useState } from "react";
import { Layout } from "../../components/Layout";
import "../../components/tabs/tabs.css";
import { openContent } from "../../components/tabs";
import "./admin_usuarios.css"

interface Usuario {
  id?: number;
  name: string;
  email: string;
  document_type: string;
  document: string;
  phone: string;
  role: string;
  password: string;
  created_at?: Date;
}

const roles = ["Colocación", "Recovery", "Admin", "Master"];  // Roles actualizados
const documentTypes = ["Identidad", "Pasaporte", "RTN"];  // Tipos de documento para Honduras
const usuariosDemo: Usuario[] = [
  {
    id: 1,
    name: "Juan Pérez",
    email: "juan.perez@example.com",
    document_type: "DNI",
    document: "0801-1990-12345",
    password: "",
    phone: "+504 9876-5432",
    role: "Admin",
    created_at: new Date("2022-05-14"),
  },
  {
    id: 2,
    name: "María Gómez",
    email: "maria.gomez@example.com",
    document_type: "Pasaporte",
    password: "",
    document: "P123456789",
    phone: "+504 9234-5678",
    role: "Colocación",
    created_at: new Date("2023-01-10"),
  },
  {
    id: 3,
    name: "Carlos López",
    email: "carlos.lopez@example.com",
    document_type: "DNI",
    password: "",
    document: "0802-1985-54321",
    phone: "+504 8765-4321",
    role: "Recovery",
    created_at: new Date("2022-08-20"),
  },
  {
    id: 4,
    name: "Ana Martínez",
    email: "ana.martinez@example.com",
    document_type: "RTN",
    document: "0803-RTN-67890",
    password: "",
    phone: "+504 9123-4567",
    role: "Master",
    created_at: new Date("2021-12-05"),
  },
  {
    id: 5,
    name: "Pedro Ramírez",
    email: "pedro.ramirez@example.com",
    document_type: "DNI",
    password: "",
    document: "0804-1992-98765",
    phone: "+504 9345-6789",
    role: "Colocación",
    created_at: new Date("2023-06-15"),
  },
];

const AdministrarUsuarios: FC = () => {
  const defaultTabRef = useRef<HTMLButtonElement>(null);

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [nuevoUsuario, setNuevoUsuario] = useState<Usuario>({
    name: "",
    email: "",
    document_type: "Identidad",
    document: "",
    phone: "",
    role: "Colocación",
    password: "",
  });

  useEffect(() => {
    setUsuarios(usuariosDemo);
    if (defaultTabRef.current) {
      defaultTabRef.current.click();
    }
  }, []);

  const agregarUsuario = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Evita el comportamiento por defecto de recargar la página
    if (nuevoUsuario.name && nuevoUsuario.email && nuevoUsuario.password) {
      setUsuarios([...usuarios, nuevoUsuario]);
      setNuevoUsuario({
        name: "",
        email: "",
        document_type: "Identidad",
        document: "",
        phone: "",
        role: "Colocación",
        password: "",
      });
    }
  };

  return (
    <Layout>
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
        <table className="usuarios-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Tipo de Documento</th>
              <th>Documento</th>
              <th>Teléfono</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario, index) => (
              <tr key={index}>
                <td>{usuario.name}</td>
                <td>{usuario.email}</td>
                <td>{usuario.document_type}</td>
                <td>{usuario.document}</td>
                <td>{usuario.phone}</td>
                <td>{usuario.role}</td>
                <td>
                  <button>Editar</button>
                  <button>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tab: Agregar Usuario */}
      <div id="agregar_usuario" className="tabcontent">
        <h3>Agregar Usuario</h3>
        <form onSubmit={agregarUsuario}>
          <input
            type="text"
            placeholder="Nombre"
            value={nuevoUsuario.name}
            onChange={(e) =>
              setNuevoUsuario({ ...nuevoUsuario, name: e.target.value })
            }
            required
          />
          <input
            type="email"
            placeholder="Correo"
            value={nuevoUsuario.email}
            onChange={(e) =>
              setNuevoUsuario({ ...nuevoUsuario, email: e.target.value })
            }
            required
          />
          <select
            value={nuevoUsuario.document_type}
            onChange={(e) =>
              setNuevoUsuario({ ...nuevoUsuario, document_type: e.target.value })
            }
            required
          >
            {documentTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Documento"
            value={nuevoUsuario.document}
            onChange={(e) =>
              setNuevoUsuario({ ...nuevoUsuario, document: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Teléfono"
            value={nuevoUsuario.phone}
            onChange={(e) =>
              setNuevoUsuario({ ...nuevoUsuario, phone: e.target.value })
            }
            required
          />
          <select
            value={nuevoUsuario.role}
            onChange={(e) =>
              setNuevoUsuario({ ...nuevoUsuario, role: e.target.value })
            }
            required
          >
            {roles.map((rol) => (
              <option key={rol} value={rol}>
                {rol}
              </option>
            ))}
          </select>
          <input
            type="password"
            placeholder="Contraseña"
            value={nuevoUsuario.password}
            onChange={(e) =>
              setNuevoUsuario({ ...nuevoUsuario, password: e.target.value })
            }
            required
          />
          <button type="submit">Agregar</button>
        </form>
      </div>
    </Layout>
  );
};

export default AdministrarUsuarios;
