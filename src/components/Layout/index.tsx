import { FC, ReactNode, useEffect, useState } from "react";
import "./layout.css";
import { LoaderScreen } from "../Loader/LoaderScreen";
import { useAppStore } from "../../store/appStore";
import { CiLogin } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { Roles } from "../../constants/permisions/Roles";

type Props = {
  children: ReactNode;
  loading?: boolean;
};

export const Layout: FC<Props> = ({ children, loading = false }) => {
  const [title, setTitle] = useState<string>("");
  const [isAsideOpen, setIsAsideOpen] = useState<boolean>(false);
  const { tokenReady, setAuthToken } = useAppStore();

  const sections = [
    {
      title: "Solicitudes de Crédito/Financiamiento",
      url: "/solicitudes",
      allowed: Roles.USER_COLLOCATION,
    },
    {
      title: "Cobros y Recibos",
      url: "/cobros",
      allowed: Roles.USER_RECOVERY,
    },
    {
      title: "Alertas",
      url: "/alertas",
      allowed: Roles.USER_ADMIN,
    },
    {
      title: "Administrar Usuarios",
      url: "/administrar-usuarios",
      allowed: Roles.USER_ADMIN,
    },
    {
      title: "Reportes",
      url: "/reportes",
      allowed: Roles.USER_ADMIN,
    },
    {
      title: "Configuración del sistema",
      url: "/configuracion",
      allowed: Roles.USER_MASTER,
    },
  ];

  const navigate = useNavigate();

  useEffect(() => {
    const filtered = sections.filter(
      (section) => section.url === window.location.pathname
    );
    if (filtered.length > 0) {
      setTitle(filtered[0].title);
    }
  }, [window.location.pathname]);

  const logout = () => {
    setAuthToken("");
  };

  return (
    <div className="layout">
      <div className="content">
        <header>
          <label className="burger" htmlFor="burger">
            <input
              type="checkbox"
              id="burger"
              onChange={() => setIsAsideOpen(!isAsideOpen)}
            />
            <span></span>
            <span></span>
            <span></span>
          </label>
          <h1>{title}</h1>
        </header>
        <div className="main-content">
          <aside className={isAsideOpen ? "open" : "closed"}>
            <ul>
              {sections.map((section, i) => (
                <li
                  key={i}
                  className={title === section.title ? "active" : ""}
                  onClick={() => navigate(section.url)}
                >
                  <span>{section.title}</span>
                </li>
              ))}
              <li className="signout" onClick={logout}>
                <span className="aside-icon">
                  <CiLogin />
                </span>
                <span>Cerrar Sesion</span>
              </li>
            </ul>
          </aside>
          <main>
            {loading || !tokenReady ? <LoaderScreen /> : <>{children}</>}
          </main>
        </div>
      </div>
    </div>
  );
};
