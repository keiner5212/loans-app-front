import { FC, useEffect, useRef, useState } from "react";
import { Layout } from "../../components/Layout";
import { openContent } from "../../components/tabs";
import "../../components/tabs/tabs.css";
import SimpleModal from "../../components/modal/simpleModal/ModalSimple";
import "./settings.css";
import { useAppStore } from "../../store/appStore";
import { getConfig } from "../../api/config/GetConfig";
import { Config } from "../../constants/config/Config";
import { getFile } from "../../api/files/GetFiles";
import { setConfig } from "../../api/config/SetConfig";
import { uploadFile } from "../../api/files/UploadFile";
import LoaderModal from "../../components/modal/Loader/LoaderModal";

const Configuracion: FC = () => {
    const defaultTabRef = useRef<HTMLButtonElement>(null);
    const [error, setError] = useState({ title: "", message: "", isOpen: false });
    const { theme } = useAppStore();
    const [loadingRequest, setLoadingRequest] = useState(false);
    const [signature, setSignature] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        signaturefromApi: null,
        interestRate: 0,
        alertFrequency: "Diaria",
        maxCreditAmount: 0,
        minCreditAmount: 0,
    });

    useEffect(() => {
        if (defaultTabRef.current) {
            defaultTabRef.current.click();
        }
        setLoadingRequest(true);

        const loadConfigurations = async () => {
            try {
                const interestRateRes = await getConfig(Config.INTEREST_RATE);
                const alertFrequencyRes = await getConfig(Config.ALERT_FREQUENCY);
                const signatureRes = await getConfig(Config.SIGNATURE);
                const maxCreditAmountRes = await getConfig(Config.MAX_CREDIT_AMOUNT);
                const minCreditAmountRes = await getConfig(Config.MIN_CREDIT_AMOUNT);

                setFormData({
                    interestRate: parseFloat(interestRateRes?.data.value || "0"),
                    alertFrequency: alertFrequencyRes?.data.value || "Diaria",
                    signaturefromApi: signatureRes?.data.value || null,
                    maxCreditAmount: parseFloat(maxCreditAmountRes?.data.value || "0"),
                    minCreditAmount: parseFloat(minCreditAmountRes?.data.value || "0"),
                });
                setLoadingRequest(false);
            } catch (error) {
                setError({
                    title: "Error",
                    message: "Error cargando configuraciones.",
                    isOpen: true,
                });
            }
        };

        loadConfigurations();
    }, []);

    useEffect(() => {
        if (formData.signaturefromApi) {
            setLoadingRequest(true);
            getFile(formData.signaturefromApi).then((response) => {
                if (response) {
                    const previewUrl = URL.createObjectURL(response);
                    setPreviewImage(previewUrl);
                }
            }).finally(() => {
                setLoadingRequest(false);
            });
        }
    }, [formData.signaturefromApi]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setSignature(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const guardarConfiguraciones = async (e: React.FormEvent) => {
        e.preventDefault();

        if (loadingRequest) return;

        setLoadingRequest(true);

        try {
            let signaturePath = formData.signaturefromApi;

            if (signature) {
                const fileSaved = await uploadFile(signature);
                if (fileSaved) {
                    signaturePath = fileSaved.filePath;
                }
            }

            await setConfig(Config.INTEREST_RATE, formData.interestRate.toString());
            await setConfig(Config.ALERT_FREQUENCY, formData.alertFrequency);
            await setConfig(Config.SIGNATURE, signaturePath || '');
            await setConfig(Config.MAX_CREDIT_AMOUNT, formData.maxCreditAmount.toString());
            await setConfig(Config.MIN_CREDIT_AMOUNT, formData.minCreditAmount.toString());

            setLoadingRequest(false);

            setError({
                title: "Éxito",
                message: "Configuraciones guardadas correctamente.",
                isOpen: true,
            });
        } catch (error) {
            setError({
                title: "Error",
                message: "Hubo un problema guardando las configuraciones.",
                isOpen: true,
            });
        }
    };


    return (
        <Layout>
            <LoaderModal isOpen={loadingRequest} />
            <div className="tab">
                <button
                    className="tablinks"
                    ref={defaultTabRef}
                    onClick={(event) => openContent(event, "configuraciones")}
                >
                    Configuraciones
                </button>
            </div>

            <div id="configuraciones" className={`tabcontent ${theme}`}>
                <form onSubmit={guardarConfiguraciones}>
                    <h3>Configuraciones</h3>
                    <div>
                        <label>Frecuencia de Alertas:</label>
                        <select
                            name="alertFrequency"
                            value={formData.alertFrequency}
                            onChange={handleInputChange}
                        >
                            <option value="Diaria">Diaria</option>
                            <option value="Semanal">Semanal</option>
                            <option value="Mensual">Mensual</option>
                        </select>
                    </div>
                    <div>
                        <label>Tasa de Interés Efectivo mensual (0.01 = 1%):</label>
                        <input
                            type="number"
                            name="interestRate"
                            value={formData.interestRate}
                            onChange={handleInputChange}
                            min="0"
                            step="0.001"
                        />
                        <span className={theme}>Equivalente a: {formData.interestRate * 100}%</span>
                    </div>
                    <div>
                        <label>Monto Máximo de Crédito:</label>
                        <input
                            type="number"
                            name="maxCreditAmount"
                            value={formData.maxCreditAmount}
                            onChange={handleInputChange}
                            min="0"
                        />
                    </div>
                    <div>
                        <label>Monto Mínimo de Crédito:</label>
                        <input
                            type="number"
                            name="minCreditAmount"
                            value={formData.minCreditAmount}
                            onChange={handleInputChange}
                            min="0"
                        />
                    </div>
                    <div>
                        <label>Subir Firma:</label>
                        {previewImage ? (
                            <div className="signature-preview">
                                <img
                                    src={previewImage}
                                    alt="Firma"
                                    style={{ maxWidth: "200px", maxHeight: "100px" }}
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSignature(null);
                                        setPreviewImage(null);
                                    }}
                                >
                                    Cambiar Firma
                                </button>
                            </div>
                        ) : (
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        )}
                    </div>
                    <button type="submit">Guardar Configuraciones</button>
                </form>
            </div>

            <SimpleModal
                isOpen={error.isOpen}
                title={error.title}
                message={error.message}
                hasTwoButtons={false}
                button1Text="Ok"
                button1Action={() => setError({ title: "", message: "", isOpen: false })}
                closeOnOutsideClick={true}
                onClose={() => setError({ title: "", message: "", isOpen: false })}
            />
        </Layout>
    );
};

export default Configuracion;
