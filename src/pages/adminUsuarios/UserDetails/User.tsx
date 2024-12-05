import { FunctionComponent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Layout } from "../../../components/Layout";
import "../../solicitudes/CreditDetails/details.css";
import { LoaderScreen } from "../../../components/Loader/LoaderScreen";
import { getUserById } from "../../../api/user/userData";
import { Usuario } from "..";
import { useAppStore } from "../../../store/appStore";
import { getFile } from "../../../api/files/GetFiles";
import { formatUtcToLocal } from "../../../utils/formats/formatToLocal";

interface UserDetailsProps { }

const UserDetails: FunctionComponent<UserDetailsProps> = () => {
    // get User id from url
    const { id } = useParams();

    const { theme } = useAppStore();
    const [loading, setLoading] = useState(true);
    const [usuario, setUsuario] = useState<Usuario>();
    const navigate = useNavigate();
    const [loadingMedia, setLoadingMedia] = useState(false);
    const [mediaLinks, setMediaLinks] = useState<{ [key: string]: string | null }>({
        locationCroquis: null,
        documentImageFront: null,
        documentImageBack: null,
        proofOfIncome: null,
    });

    const handleGoback = () => {
        navigate(-1);
    };

    useEffect(() => {
        if (id) {
            getUserById(Number(id))
                .then((response) => {
                    setUsuario(response);
                })
                .catch((error) => {
                    console.error("Error fetching user:", error);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [id]);

    useEffect(() => {
        if (usuario) {
            setLoadingMedia(true);
            async function getMediaFromUser(usuario: Usuario) {
                const getMedia = async (filename: string, onSuccess: (url: string) => void) => {
                    const fileResponse = await getFile(filename);
                    const url = URL.createObjectURL(fileResponse);
                    onSuccess(url);
                };

                if (usuario.locationCroquis) {
                    await getMedia(usuario.locationCroquis, (url) => {
                        setMediaLinks((prevLinks) => ({
                            ...prevLinks,
                            locationCroquis: url,
                        }));
                    });
                }

                if (usuario.documentImageFront) {
                    await getMedia(usuario.documentImageFront, (url) => {
                        setMediaLinks((prevLinks) => ({
                            ...prevLinks,
                            documentImageFront: url,
                        }));
                    });
                }

                if (usuario.documentImageBack) {
                    await getMedia(usuario.documentImageBack, (url) => {
                        setMediaLinks((prevLinks) => ({
                            ...prevLinks,
                            documentImageBack: url,
                        }));
                    });
                }

                if (usuario.proofOfIncome) {
                    await getMedia(usuario.proofOfIncome, (url) => {
                        setMediaLinks((prevLinks) => ({
                            ...prevLinks,
                            proofOfIncome: url,
                        }));
                    });
                }
            }
            getMediaFromUser(usuario).then(() => setLoadingMedia(false));
        }
    }, [usuario]);

    const renderField = (label: string, value: any) => (
        <div className={"details-field" + " " + theme}>
            <span className="field-label">{label}:</span>
            <span className="field-value">{value !== null ? value : "No data"}</span>
        </div>
    );

    const renderImagePreview = (url: string, label: string) => (
        <div className="image-preview">
            <img src={url} alt={label} style={{ width: "100px", height: "auto" }} />
            <button
                onClick={() => window.open(url, "_blank")}
                className="view-full-screen"
            >
                View Full Screen
            </button>
        </div>
    );

    if (loading || loadingMedia) {
        return (
            <Layout>
                <LoaderScreen />
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="details-container">
                <div className="details-header">
                    <button onClick={handleGoback} className="back-button">
                        Go back
                    </button>
                </div>
                {usuario ? (
                    <div className="details-grid">
                        {renderField("ID", usuario.id)}
                        {renderField("Name", usuario.name)}
                        {renderField("Age", usuario.age)}
                        {renderField("Email", usuario.email)}
                        {renderField("Document Type", usuario.document_type)}
                        {renderField("Document", usuario.document)}
                        {renderField("Phone", usuario.phone)}
                        {renderField("Role", usuario.role)}
                        {renderField(
                            "Created At",
                            formatUtcToLocal(usuario.created_at, import.meta.env.VITE_LOCALE, import.meta.env.VITE_TIMEZONE)
                        )}

                        {mediaLinks.locationCroquis && (
                            <div>
                                {renderField("Location Croquis", "View Image")}
                                {renderImagePreview(mediaLinks.locationCroquis, "Location Croquis")}
                            </div>
                        )}

                        {mediaLinks.documentImageFront && (
                            <div>
                                {renderField("Document Image Front", "View Image")}
                                {renderImagePreview(mediaLinks.documentImageFront, "Document Image Front")}
                            </div>
                        )}

                        {mediaLinks.documentImageBack && (
                            <div>
                                {renderField("Document Image Back", "View Image")}
                                {renderImagePreview(mediaLinks.documentImageBack, "Document Image Back")}
                            </div>
                        )}

                        {mediaLinks.proofOfIncome && (
                            <div>
                                {renderField(
                                    "Proof of Income",
                                    <a href={mediaLinks.proofOfIncome} target="_blank" rel="noopener noreferrer">
                                        View PDF
                                    </a>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <p>No user data found.</p>
                )}
            </div>
        </Layout>
    );
};

export default UserDetails;
