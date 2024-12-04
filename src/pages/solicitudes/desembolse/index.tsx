import { FunctionComponent, useState } from "react";
import { Layout } from "../../../components/Layout";
import { useNavigate, useParams } from "react-router-dom";
import "./release.css";
import ContratoContainer from "../../../pdf/ContratoContainer";
import { uploadFile } from "../../../api/files/UploadFile";
import { SaveCreditContract } from "../../../api/credit/SaveSignature";
import SimpleModal from "../../../components/modal/simpleModal/ModalSimple";

interface DesembolseProps { }

const Desembolse: FunctionComponent<DesembolseProps> = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [signature, setSignature] = useState<File | null>(null);
    const [modaldata, setModalData] = useState({ isOpen: false, title: "", message: "" });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setSignature(file);
        }
    };

    const handleSaveSignature = async () => {
        setLoading(true);
        if (signature) {
            const fileSaved = await uploadFile(signature);
            if (fileSaved && id) {
                const signaturePath = fileSaved.filePath;
                await SaveCreditContract(parseInt(id), signaturePath);
                setModalData({
                    isOpen: true,
                    title: "Contrato Firmado",
                    message: "El contrato ha sido firmado exitosamente."
                });
                setLoading(false);
            } else {
                setLoading(false);
                setModalData({
                    isOpen: true,
                    title: "Error",
                    message: "Hubo un problema firmando el contrato."
                });
            }
        } else {
            setLoading(false);
            setModalData({
                isOpen: true,
                title: "Error",
                message: "Debes subir un contrato firmado."
            });
        }
    };

    const [showContrato, setShowContrato] = useState(false);

    const handleGoback = () => {
        navigate(-1);
    };

    const handleToggleContrato = () => {
        setShowContrato((prev) => !prev);
    };


    return (
        <Layout>
            <div>
                <div className="layout-container-header">
                    <button onClick={handleGoback} className="back-button">
                        Go back
                    </button>
                </div>
                <div className="layout-container">
                    <div className="release-container">
                        <div className="release-content">
                            <div>
                                <label>Generar Contrato</label>
                                <button onClick={handleToggleContrato}>Contrato</button>
                            </div>
                            <div>
                                <label>Subir contrato Firmado</label>
                                <input type="file" className="file-input" accept=".pdf"
                                    onChange={handleFileChange} />
                                <button onClick={handleSaveSignature} disabled={loading}>Guardar</button>
                            </div>
                            {showContrato && id && !loading && (
                                <div className="pdf-viewer-container">
                                    <ContratoContainer id={id} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <SimpleModal
                    isOpen={modaldata.isOpen}
                    title={modaldata.title}
                    message={modaldata.message}
                    hasTwoButtons={false}
                    button1Text="Ok"
                    button1Action={() => setModalData({ title: "", message: "", isOpen: false })}
                    closeOnOutsideClick={true}
                    onClose={() => setModalData({ title: "", message: "", isOpen: false })}
                />
            </div>
        </Layout>
    );
};

export default Desembolse;
