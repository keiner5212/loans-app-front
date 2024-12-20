import "./auth.css";
import { FunctionComponent, useEffect, useRef, useState } from "react";
import { Loader } from "@/components/Loader";
import { Link, useNavigate } from "react-router-dom";
import { init } from "@/assets/animations/background";
import SimpleModal from "@/components/modal/simpleModal/ModalSimple";
import { forgotPassword, forgotPasswordChangePassword, forgotPasswordCodeSend } from "@/api/auth";
import { HttpStatusCode } from "axios";

interface ForgotPasswordProps {

}

const ForgotPassword: FunctionComponent<ForgotPasswordProps> = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        if (canvasRef.current) init();
    }, [canvasRef]);

    const [formData, setFormData] = useState({ email: "", code: 0, password: "" });
    const [stage, setStage] = useState(1);

    const onchange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const [error, setError] = useState({
        title: "",
        message: "",
        isOpen: false,
    });

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const onSubmitEmail = async (e: any) => {
        e.preventDefault();

        setLoading(true);

        const res = await forgotPassword(formData.email);

        if (res) {
            if (res.status === HttpStatusCode.Ok) {
                setStage(2);
            } else if (res.status === HttpStatusCode.NotFound) {
                setError({
                    title: "Error",
                    message: res.data,
                    isOpen: true,
                })
            } else if (res.status === HttpStatusCode.BadRequest) {
                setError({
                    title: "Error de configuración",
                    message: res.data,
                    isOpen: true
                })
            }
        } else {
            setError({
                title: "Error",
                message: "Error al enviar el correo",
                isOpen: true,
            })
        }

        setLoading(false);
    };

    const onSubmitCode = async (e: any) => {
        e.preventDefault();

        setLoading(true);
        const res = await forgotPasswordCodeSend(formData.email, formData.code);

        if (res) {
            if (res.status === HttpStatusCode.Ok) {
                setStage(3);
            } else {
                setError({
                    title: "Error",
                    message: res.data,
                    isOpen: true,
                })
            }
        } else {
            setError({
                title: "Error",
                message: "Error al enviar el codigo",
                isOpen: true,
            })
        }

        setLoading(false);

    }

    const onsubmitPassword = async (e: any) => {
        e.preventDefault();

        setLoading(true);

        const res = await forgotPasswordChangePassword(formData.email, formData.password, formData.code);

        if (res) {
            if (res.status === HttpStatusCode.Ok) {
                navigate("/login");
            } else {
                setError({
                    title: "Error",
                    message: res.data,
                    isOpen: true,
                })
            }
        } else {
            setError({
                title: "Error",
                message: "Error al cambiar la contraseña",
                isOpen: true,
            })
        }
    }

    return (
        <div className="layout">
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
            <canvas id="demo-canvas" ref={canvasRef}></canvas>
            {stage === 1 && (
                <form className="form" onSubmit={onSubmitEmail}>
                    <p className="title">Recuperar contraseña </p>
                    <p className="message">Ingresa tu correo para recuperar tu contraseña. </p>
                    <label>
                        <input
                            required
                            placeholder=""
                            type="email"
                            className="input"
                            onChange={onchange}
                            name="email"
                        />
                        <span>Email</span>
                    </label>

                    <button className="submit" disabled={loading}>
                        Enviar codigo
                        {loading && (
                            <span>
                                <Loader size="20px" />
                            </span>
                        )}
                    </button>
                    <p className="signin">
                        Regresar al <Link to="/login">Login</Link>{" "}
                    </p>
                </form>
            )}

            {stage === 2 && (
                <form className="form" onSubmit={onSubmitCode}>
                    <p className="title">Codigo Enviado </p>
                    <p className="message">Se ha enviado tu codigo de verificacion a los usuarios Master, ponte en contacto con ellos e ingresa el codigo. </p>
                    <label>
                        <input
                            required
                            placeholder=""
                            type="text"
                            className="input"
                            onChange={(e) => {
                                const target = e.target
                                const value = target.value
                                if (value.length != 6 || isNaN(parseInt(value))) {
                                    target.setCustomValidity("El codigo debe ser un número de 6 digitos")
                                } else {
                                    target.setCustomValidity("")
                                }
                                onchange(e);
                            }}
                            name="code"
                        />
                        <span>Code</span>
                    </label>

                    <button className="submit" disabled={loading}>
                        Aceptar
                        {loading && (
                            <span>
                                <Loader size="20px" />
                            </span>
                        )}
                    </button>
                    <p className="signin">
                        Regresar al <Link to="/login">Login</Link>{" "}
                    </p>
                </form>
            )}

            {stage === 3 && (
                <form className="form" onSubmit={onsubmitPassword}>
                    <p className="title">Solo un paso mas... </p>
                    <p className="message">Ingresa tu nueva contraseña. </p>
                    <label>
                        <input
                            required
                            placeholder=""
                            type="password"
                            className="input"
                            onChange={(e) => {
                                const input = e.target;
                                const value = input.value;
                                if (value.length < 5) {
                                    input.setCustomValidity("La contraseña debe tener al menos 5 caracteres.");
                                } else {
                                    input.setCustomValidity("");
                                }
                                onchange(e);
                            }}
                            name="password"
                        />
                        <span>Password</span>
                    </label>
                    <label>
                        <input
                            required
                            placeholder=""
                            type="password"
                            className="input"
                            onChange={(e) => {
                                const input = e.target;
                                const value = input.value;
                                if (value != formData.password) {
                                    input.setCustomValidity("Las contraseñas deben ser iguales.");
                                } else {
                                    input.setCustomValidity("");
                                }
                            }}
                            name="password-confirm"
                        />
                        <span>Confirm Password</span>
                    </label>

                    <button className="submit" disabled={loading}>
                        Aceptar
                        {loading && (
                            <span>
                                <Loader size="20px" />
                            </span>
                        )}
                    </button>
                    <p className="signin">
                        Regresar al <Link to="/login">Login</Link>{" "}
                    </p>
                </form>
            )}
        </div>
    );
}

export default ForgotPassword;