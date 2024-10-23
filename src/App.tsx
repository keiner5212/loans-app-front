import { Routes, Route, BrowserRouter } from "react-router-dom";
//lazy import
import { lazy, Suspense, ComponentType } from "react";
import { LoaderScreen } from "./components/Loader/LoaderScreen";

const Home = lazy<ComponentType>(() => import("./pages/home/index"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoaderScreen />}>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
