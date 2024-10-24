import { Routes, Route, BrowserRouter } from "react-router-dom";
//lazy import
import { lazy, Suspense, ComponentType, useEffect } from "react";
import { LoaderScreen } from "./components/Loader/LoaderScreen";
import { useAppStore } from "./store/appStore";
import { configureAxios } from "./api/axiosInstance";


const Home = lazy<ComponentType>(() => import("./pages/home/index"));
const Login = lazy<ComponentType>(() => import("./pages/Auth/Login"));
const Solicitudes = lazy<ComponentType>(() => import("./pages/solicitudes/index"));
const Alertas = lazy<ComponentType>(() => import("./pages/alertas/index"));
const Cobros = lazy<ComponentType>(() => import("./pages/cobros/index"));
const Reportes = lazy<ComponentType>(() => import("./pages/reportes/index"));
const Configuracion = lazy<ComponentType>(() =>
  import("./pages/settings/index")
);
const AdministrarUsuarios = lazy<ComponentType>(() =>
  import("./pages/adminUsuarios/index")
);


function App() {
  const { authToken, setTokenReady, setAuthToken } = useAppStore();

  useEffect(() => {
    if (
      (!authToken || authToken === "") &&
      window.location.pathname !== "/login"
    ) {
      window.location.href = "/login";
      setTokenReady(false);
    }

    if (authToken && authToken !== "") {
      localStorage.setItem("authToken", authToken);
      configureAxios(() => {
        setAuthToken("");
      });
      setTokenReady(true);
    }
  }, [authToken]);

  return (
    <BrowserRouter>
      <Suspense fallback={<LoaderScreen />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/solicitudes" element={<Solicitudes />} />
          <Route path="/cobros" element={<Cobros />} />
          <Route path="/alertas" element={<Alertas />} />
          <Route path="/reportes" element={<Reportes />} />
          <Route path="/configuracion" element={<Configuracion />} />
          <Route path="/administrar-usuarios" element={<AdministrarUsuarios />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
