import { FC } from "react";
import { Layout } from "../../components/Layout";
import "./Home.css";
import { useAppStore } from "../../store/appStore";

const Home: FC = () => {
  const { theme } = useAppStore();
  return (
    <Layout>
      <div className={"home-container" + " " + theme}>
        <h1 className="home-title">¡Bienvenido!</h1>
        <p className="home-message">
          Usa el menú en la parte superior izquierda para explorar las opciones
          disponibles y acceder a lo que necesites.
        </p>
      </div>
    </Layout>
  );
};

export default Home;
