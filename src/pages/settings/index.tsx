import { FC, useEffect, useRef, useState } from "react";
import { Layout } from "../../components/Layout";
import { openContent } from "../../components/tabs";
import "../../components/tabs/tabs.css";
import SimpleModal from "../../components/modal/simpleModal/ModalSimple";
import "./settings.css"

const Configuracion: FC = () => {
    const defaultTabRef = useRef<HTMLButtonElement>(null);
    const [frecuenciaAlertas, setFrecuenciaAlertas] = useState("Diaria");
    const [firma, setFirma] = useState<File | null>(null);
    const [error, setError] = useState({ title: "", message: "", isOpen: false });

    useEffect(() => {
        if (defaultTabRef.current) {
            defaultTabRef.current.click();
        }
    }, []);

    const guardarConfiguraciones = () => {
        if (firma) {
            setError({
                title: "Éxito",
                message: "Las configuraciones se han guardado correctamente.",
                isOpen: true,
            });
        } else {
            setError({
                title: "Error",
                message: "Debes subir una firma.",
                isOpen: true,
            });
        }
    };

    return (
        <Layout>
            <div className="tab">
                <button
                    className="tablinks"
                    ref={defaultTabRef}
                    onClick={(event) => openContent(event, "configuraciones")}
                >
                    Configuraciones
                </button>
            </div>

            {/* Tab: Configuraciones */}
            <div id="configuraciones" className="tabcontent">
                <h3>Configuraciones</h3>
                <div>
                    <label>Frecuencia de Alertas:</label>
                    <select
                        value={frecuenciaAlertas}
                        onChange={(e) => setFrecuenciaAlertas(e.target.value)}
                    >
                        <option value="Diaria">Diaria</option>
                        <option value="Semanal">Semanal</option>
                        <option value="Mensual">Mensual</option>
                    </select>
                </div>
                <div>
                    <label>Subir Firma:</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            if (e.target.files) {
                                setFirma(e.target.files[0]);
                            }
                        }}
                    />
                </div>
                <button onClick={guardarConfiguraciones}>Guardar Configuraciones</button>
            </div>

            {/* Modal para mostrar errores o éxitos */}
            <SimpleModal
                isOpen={error.isOpen}
                title={error.title}
                message={error.message}
                hasTwoButtons={false}
                button1Text="Ok"
                button1Action={() => {
                    setError({ title: "", message: "", isOpen: false });
                }}
                closeOnOutsideClick={true}
                onClose={() => {
                    setError({ title: "", message: "", isOpen: false });
                }}
            />
        </Layout>
    );
}

export default Configuracion;
