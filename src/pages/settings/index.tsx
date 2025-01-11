import { FC, useEffect, useRef, useState } from "react";
import { Layout } from "@/components/Layout";
import { openContent } from "@/components/tabs";
import "@/components/tabs/tabs.css";
import SimpleModal from "@/components/modal/simpleModal/ModalSimple";
import "./settings.css";
import { useAppStore } from "@/store/appStore";
import { getConfig } from "@/api/config/GetConfig";
import { Config } from "@/constants/config/Config";
import { getFile } from "@/api/files/GetFiles";
import { setConfig } from "@/api/config/SetConfig";
import { uploadFile } from "@/api/files/UploadFile";
import LoaderModal from "@/components/modal/Loader/LoaderModal";

export enum AlertFrequency {
    DAILY = "Daily",
    WEEKLY = "Weekly",
    MONTHLY = "Monthly",
}

const Configuracion: FC = () => {
    const defaultTabRef = useRef<HTMLButtonElement>(null);
    const [error, setError] = useState({ title: "", message: "", isOpen: false });
    const { theme } = useAppStore();
    const [loadingRequest, setLoadingRequest] = useState(false);
    const [signature, setSignature] = useState<File | null>(null);
    const [previewSignature, setPreviewSignature] = useState<string | null>(null);
    const [documentLogo, setDocumentLogo] = useState<File | null>(null);
    const [previewLogo, setPreviewLogo] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        signaturefromApi: null,
        documentLogofromApi: null,
        interestRate: 0,
        dailyInerestDelay: 0,
        alertFrequency: "Diaria",
        maxCreditAmount: 0,
        minCreditAmount: 0,
        documentName: "",
        companyRegistration: "",
        companyAddress: "",
        companyPhone: "",
        companyEmail: "",
    });

    useEffect(() => {
        if (defaultTabRef.current) {
            defaultTabRef.current.click();
        }
        setLoadingRequest(true);

        const loadConfigurations = async () => {
            try {
                const interestRateRes = await getConfig(Config.INTEREST_RATE);
                const dailyInerestDelay = await getConfig(Config.DAILY_INTEREST_DELAY);
                const alertFrequencyRes = await getConfig(Config.ALERT_FREQUENCY);
                const signatureRes = await getConfig(Config.SIGNATURE);
                const documentLogoRes = await getConfig(Config.DOCUMENT_LOGO);
                const maxCreditAmountRes = await getConfig(Config.MAX_CREDIT_AMOUNT);
                const minCreditAmountRes = await getConfig(Config.MIN_CREDIT_AMOUNT);
                const documentNameRes = await getConfig(Config.DOCUMENT_NAME);
                const companyRegistrationRes = await getConfig(Config.COMPANY_REGISTRATION);
                const companyAddressRes = await getConfig(Config.COMPANY_ADDRESS);
                const companyPhoneRes = await getConfig(Config.COMPANY_PHONE);
                const companyEmailRes = await getConfig(Config.COMPANY_EMAIL);

                setFormData({
                    interestRate: parseFloat(interestRateRes?.data.value || "0"),
                    dailyInerestDelay: parseFloat(dailyInerestDelay?.data.value || "0"),
                    alertFrequency: alertFrequencyRes?.data.value || "Diaria",
                    signaturefromApi: signatureRes?.data.value || null,
                    documentLogofromApi: documentLogoRes?.data.value || null,
                    maxCreditAmount: parseFloat(maxCreditAmountRes?.data.value || "0"),
                    minCreditAmount: parseFloat(minCreditAmountRes?.data.value || "0"),
                    documentName: documentNameRes?.data.value || "",
                    companyRegistration: companyRegistrationRes?.data.value || "",
                    companyAddress: companyAddressRes?.data.value || "",
                    companyPhone: companyPhoneRes?.data.value || "",
                    companyEmail: companyEmailRes?.data.value || "",
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
                    setPreviewSignature(previewUrl);
                }
            }).finally(() => {
                setLoadingRequest(false);
            });
        }
    }, [formData.signaturefromApi]);


    useEffect(() => {
        if (formData.documentLogofromApi) {
            setLoadingRequest(true);
            getFile(formData.documentLogofromApi).then((response) => {
                if (response) {
                    const previewUrl = URL.createObjectURL(response);
                    setPreviewLogo(previewUrl);
                }
            }).finally(() => {
                setLoadingRequest(false);
            });
        }
    }, [formData.documentLogofromApi]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        setFile: React.Dispatch<React.SetStateAction<File | null>>,
        setPreview: React.Dispatch<React.SetStateAction<string | null>>
    ) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const guardarConfiguraciones = async (e: React.FormEvent) => {
        e.preventDefault();

        if (loadingRequest) return;

        setLoadingRequest(true);

        try {
            let signaturePath = formData.signaturefromApi;
            let documentLogoPath = formData.documentLogofromApi;

            if (signature) {
                const fileSaved = await uploadFile(signature);
                if (fileSaved) {
                    signaturePath = fileSaved.filePath;
                }
            }

            if (documentLogo) {
                const fileSaved = await uploadFile(documentLogo);
                if (fileSaved) {
                    documentLogoPath = fileSaved.filePath;
                }
            }

            await setConfig(Config.INTEREST_RATE, formData.interestRate.toString());
            await setConfig(Config.DAILY_INTEREST_DELAY, formData.dailyInerestDelay.toString());
            await setConfig(Config.ALERT_FREQUENCY, formData.alertFrequency);
            await setConfig(Config.SIGNATURE, signaturePath || "");
            await setConfig(Config.DOCUMENT_LOGO, documentLogoPath || "");
            await setConfig(Config.MAX_CREDIT_AMOUNT, formData.maxCreditAmount.toString());
            await setConfig(Config.MIN_CREDIT_AMOUNT, formData.minCreditAmount.toString());
            await setConfig(Config.DOCUMENT_NAME, formData.documentName);
            await setConfig(Config.COMPANY_REGISTRATION, formData.companyRegistration);
            await setConfig(Config.COMPANY_ADDRESS, formData.companyAddress);
            await setConfig(Config.COMPANY_PHONE, formData.companyPhone);
            await setConfig(Config.COMPANY_EMAIL, formData.companyEmail);

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
                            <option value={AlertFrequency.DAILY}>Diaria</option>
                            <option value={AlertFrequency.WEEKLY}>Semanal</option>
                            <option value={AlertFrequency.MONTHLY}>Mensual</option>
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
                        <span className={theme}>Equivalente a: {formData.interestRate * 100}% de interés mensual</span>
                    </div>
                    <div>
                        <label>Tasa de Interés por retraso diario (0.01 = 1%):</label>
                        <input
                            type="number"
                            name="dailyInerestDelay"
                            value={formData.dailyInerestDelay}
                            onChange={handleInputChange}
                            min="0"
                            step="0.001"
                        />
                        <span className={theme}>Equivalente a: {formData.dailyInerestDelay * 100}% de interés (sobre el pago) por dia de retraso</span>
                    </div>
                    <div>
                        <label>Monto Máximo de Crédito (0 = Desactivado):</label>
                        <input
                            type="number"
                            name="maxCreditAmount"
                            value={formData.maxCreditAmount}
                            onChange={handleInputChange}
                            min="0"
                        />
                    </div>
                    <div>
                        <label>Monto Mínimo de Crédito (0 = Desactivado):</label>
                        <input
                            type="number"
                            name="minCreditAmount"
                            value={formData.minCreditAmount}
                            onChange={handleInputChange}
                            min="0"
                        />
                    </div>
                    <div>
                        <label>Nombre de la Empresa:</label>
                        <input
                            type="text"
                            name="documentName"
                            value={formData.documentName}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label>Registro de la Empresa (RTN):</label>
                        <input
                            type="text"
                            name="companyRegistration"
                            value={formData.companyRegistration}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label>Dirección de la Empresa:</label>
                        <input
                            type="text"
                            name="companyAddress"
                            value={formData.companyAddress}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label>Teléfono de la Empresa:</label>
                        <input
                            type="text"
                            name="companyPhone"
                            value={formData.companyPhone}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label>Email de la Empresa:</label>
                        <input
                            type="email"
                            name="companyEmail"
                            value={formData.companyEmail}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label>Subir Firma:</label>
                        {previewSignature ? (
                            <div className="signature-preview">
                                <img
                                    src={previewSignature}
                                    alt="Firma"
                                    style={{ maxWidth: "200px", maxHeight: "100px" }}
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSignature(null);
                                        setPreviewSignature(null);
                                    }}
                                >
                                    Cambiar Firma
                                </button>
                            </div>
                        ) : (
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    handleFileChange(e, setSignature, setPreviewSignature);
                                }}
                            />
                        )}
                    </div>
                    <div>
                        <label>Subir Logo para Documentos:</label>
                        {previewLogo ? (
                            <div className="logo-preview">
                                <img
                                    src={previewLogo}
                                    alt="Logo"
                                    style={{ maxWidth: "200px", maxHeight: "100px" }}
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setDocumentLogo(null);
                                        setPreviewLogo(null);
                                    }}
                                >
                                    Cambiar Logo
                                </button>
                            </div>
                        ) : (
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    handleFileChange(e, setDocumentLogo, setPreviewLogo);
                                }}
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
