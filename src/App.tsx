import { Routes, Route, BrowserRouter } from "react-router-dom";
//lazy import
import { lazy, Suspense, ComponentType, useEffect } from "react";
import { LoaderScreen } from "./components/Loader/LoaderScreen";
import { useAppStore } from "./store/appStore";
import { configureAxios } from "./api/axiosInstance";

const Home = lazy<ComponentType>(() => import("./pages/home/index"));
const Login = lazy<ComponentType>(() => import("./pages/Auth/Login"));
const Solicitudes = lazy<ComponentType>(() => import("./pages/solicitudes/index"));

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
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
