import { Routes, Route, BrowserRouter, useNavigate } from "react-router-dom";
//lazy import
import { lazy, Suspense, ComponentType, useEffect } from "react";
import { LoaderScreen } from "./components/Loader/LoaderScreen";
import { useAppStore } from "./store/appStore";

const Home = lazy<ComponentType>(() => import("./pages/home/index"));
const Login = lazy<ComponentType>(() => import("./pages/Auth/Login"));

function App() {
  const authToken = useAppStore((state) => state.authToken);

  useEffect(() => {
    if ((!authToken || authToken === "") && window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
  }, [authToken]);

  return (
    <BrowserRouter>
      <Suspense fallback={<LoaderScreen />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
