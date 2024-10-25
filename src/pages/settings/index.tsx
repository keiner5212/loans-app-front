import { FC, useEffect, useRef } from "react";
import { Layout } from "../../components/Layout";
import { openContent } from "../../components/tabs";
import "../../components/tabs/tabs.css";

const Configuracion: FC = () => {
    const defaultTabRef = useRef<HTMLButtonElement>(null);
  
    useEffect(() => {
      if (defaultTabRef.current) {
        defaultTabRef.current.click();
      }
    }, []);
  
    return (
      <Layout>
        <div className="tab">
          <button
            className="tablinks"
            ref={defaultTabRef}
            onClick={(event) => openContent(event, "sol_credito")}
          >
            Añadir solicitud de Crédito
          </button>
          <button
            className="tablinks"
            onClick={(event) => openContent(event, "sol_financiamiento")}
          >
            Añadir solicitud de Financiamiento
          </button>
          <button
            className="tablinks"
            onClick={(event) => openContent(event, "admin_solicitudes")}
          >
            Administrar solicitudes
          </button>
        </div>
  
        <div id="sol_credito" className="tabcontent">
          
        </div>
  
        <div id="sol_financiamiento" className="tabcontent">
          
        </div>
  
        <div id="admin_solicitudes" className="tabcontent">
          
        </div>
      </Layout>
    );
}

export default Configuracion