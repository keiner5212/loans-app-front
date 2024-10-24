import { FC } from "react";
import { Layout } from "../../components/Layout";
import "./Home.css";

const Home: FC = () => {
  return (
    <Layout>
      <div className="home-container">
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
