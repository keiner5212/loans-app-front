import { FC, ReactNode, useEffect, useRef, useState } from "react";
import "./layout.css";
import { LoaderScreen } from "../Loader/LoaderScreen";
import { useAppStore } from "@/store/appStore";
import { CiLogin } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { Roles } from "@/constants/permisions/Roles";
import { hasPermision } from "@/utils/security/Permisions";
import { FaUser } from "react-icons/fa";

type Props = {
  children: ReactNode;
  loading?: boolean;
};

export const Layout: FC<Props> = ({ children, loading = false }) => {
  const [title, setTitle] = useState<string>("");
  const [isAsideOpen, setIsAsideOpen] = useState<boolean>(false);
  const { tokenReady, setAuthToken, userInfo, theme, setTheme } = useAppStore();

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
      title: "Exportar Reportes",
      url: "/reportes",
      allowed: Roles.USER_ADMIN,
    },
    {
      title: "Configuración del sistema",
      url: "/configuracion",
      allowed: Roles.USER_MASTER,
    },
  ];

  useEffect(() => {
    //get theme from localstorage and set it
    const themesaved = localStorage.getItem("theme");
    if (themesaved) {
      setTheme(themesaved)

      if (themeswitchRef.current) {
        (themeswitchRef.current as HTMLInputElement).checked = themesaved === "dark";
      }
    };
  }, []);

  const navigate = useNavigate();

  useEffect(() => {
    const filtered = sections.filter(
      (section) => section.url === window.location.pathname
    );
    if (filtered.length > 0) {
      setTitle(filtered[0].title || "");
    }
  }, [window.location.pathname]);

  const logout = () => {
    localStorage.removeItem("authToken");
    setAuthToken("");
  };

  const themeswitchRef = useRef(null);

  return (
    <div className={"layout" + " " + theme}>
      <div className="content">
        <header>
          <div className="header-left">
            <label className="burger" htmlFor="burger">
              <input
                type="checkbox"
                id="burger"
                onChange={() => setIsAsideOpen(!isAsideOpen)}
              />
              <span className={theme}></span>
              <span className={theme}></span>
              <span className={theme}></span>
            </label>
            <h1>{title}</h1>
          </div>
          <div className="user-info">
            <FaUser />
            <span>{userInfo.name}</span>
            <div className="switch">
              <label className="ui-switch">
                <input type="checkbox"
                  ref={themeswitchRef}
                  onClick={(e) => {
                    const ischecked = (e.target as HTMLInputElement).checked;
                    setTheme(ischecked ? "dark" : "light");
                    localStorage.setItem("theme", ischecked ? "dark" : "light");
                  }} />
                <div className="slider">
                  <div className="circle"></div>
                </div>
              </label>
            </div>
          </div>
        </header>
        <div className="main-content">
          <aside className={(isAsideOpen ? "open" : "closed") + " " + theme}>
            <ul>
              {sections.map((section, i) => (hasPermision(userInfo.role, section.allowed) &&
                <li
                  key={i}
                  className={(title === section.title ? "active" : "") + " " + theme}
                  onClick={() => navigate(section.url)}
                >
                  <span>{section.title}</span>
                </li>
              ))}
              <li className={"signout" + " " + theme} onClick={logout}>
                <span className="aside-icon">
                  <CiLogin />
                </span>
                <span>Cerrar Sesion</span>
              </li>
            </ul>
          </aside>
          <main className={theme}>
            {loading || !tokenReady ? <LoaderScreen /> : <>{children}</>}
          </main>
        </div>
      </div>
    </div>
  );
};
