import { Routes, Route, BrowserRouter } from "react-router-dom";
//lazy import
import { lazy, Suspense, ComponentType, useEffect, useState } from "react";
import { LoaderScreen } from "./components/Loader/LoaderScreen";
import { useAppStore } from "./store/appStore";
import { configureAxios } from "./api/axiosInstance";
import { PrivateRoute } from "./components/PrivateRoute";
import { getSelfUserInfo } from "./api/user/userData";

const Home = lazy<ComponentType>(() => import("./pages/home/index"));
const Login = lazy<ComponentType>(() => import("./pages/Auth/Login"));
const Solicitudes = lazy<ComponentType>(
  () => import("./pages/solicitudes/index")
);
const Alertas = lazy<ComponentType>(() => import("./pages/alertas/index"));
const Cobros = lazy<ComponentType>(() => import("./pages/cobros/index"));
const Reportes = lazy<ComponentType>(() => import("./pages/reportes/index"));
const Configuracion = lazy<ComponentType>(
  () => import("./pages/settings/index")
);
const AdministrarUsuarios = lazy<ComponentType>(
  () => import("./pages/adminUsuarios/index")
);
const ForgotPassword = lazy<ComponentType>(
  () => import("./pages/Auth/PasswordRecovery")
)

const CreditDetails = lazy<ComponentType>(() => import("./pages/solicitudes/CreditDetails/Credit"));
const UserDetails = lazy<ComponentType>(() => import("./pages/adminUsuarios/UserDetails/User"));
const DesembolseProps = lazy<ComponentType>(() => import("./pages/solicitudes/desembolse/index"));

function App() {
  const { authToken, setTokenReady, setAuthToken, setUserInfo } = useAppStore();
  const [localstorageChecked, setLocalStorageChecked] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem('authToken');
    if (savedToken) {
      setAuthToken(savedToken);
    } else {
      setTokenReady(true);
    }
    setLocalStorageChecked(true);
  }, []);

  const getUserData = async () => {
    const res = await getSelfUserInfo()
    if (res) {
      setUserInfo(res.data)
    }
  }

  useEffect(() => {
    if (!localstorageChecked) return;

    if (authToken && authToken !== '') {
      localStorage.setItem('authToken', authToken);
      configureAxios(() => {
        localStorage.removeItem('authToken');
        setAuthToken('');
      });

      getUserData()

      setTokenReady(true);
    } else {
      setTokenReady(false);
    }
  }, [authToken, localstorageChecked]);

  return (
    <BrowserRouter>
      <Suspense fallback={<LoaderScreen />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/solicitudes" element={<Solicitudes />} />
            <Route path="/solicitudes/:id" element={<CreditDetails />} />
            <Route path="/solicitudes/:id/desembolse" element={<DesembolseProps />} />
            <Route path="/cobros" element={<Cobros />} />
            <Route path="/alertas" element={<Alertas />} />
            <Route path="/reportes" element={<Reportes />} />
            <Route path="/configuracion" element={<Configuracion />} />
            <Route path="/administrar-usuarios" element={<AdministrarUsuarios />} />
            <Route path="/usuarios/:id" element={<UserDetails />} />
          </Route>
          <Route path="*" element={<Home />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}


export default App;
