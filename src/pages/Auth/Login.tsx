import "./auth.css";
import { init } from "../../assets/animations/background/index";
import { useEffect, useRef, useState } from "react";
import { login } from "../../api/auth";
import { useAppStore } from "../../store/appStore";
import SimpleModal from "../../components/modal/simpleModal/ModalSimple";
import { useNavigate } from "react-router-dom";
import { Loader } from "../../components/Loader";

const Login = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (canvasRef.current) init();
  }, [canvasRef]);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const { setAuthToken } = useAppStore();

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

  const onSubmit = async (e: any) => {
    e.preventDefault();

    setLoading(true);
    const res = await login(formData.email, formData.password);
    setLoading(false);

    if (res) {
      setAuthToken(res.token);
      navigate("/");
    } else {
      setError({
        title: "Error",
        message: "Credenciales invalidas",
        isOpen: true,
      });
    }
  };
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
      <form className="form" onSubmit={onSubmit}>
        <p className="title">Iniciar Sesion </p>
        <p className="message">Login now to get access. </p>
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
        <label>
          <input
            required
            placeholder=""
            type="password"
            className="input"
            onChange={onchange}
            name="password"
          />
          <span>Password</span>
        </label>
        <button className="submit" disabled={loading}>
          Acceder
          {loading && (
            <span>
              <Loader size="20px" />
            </span>
          )}
        </button>
        <p className="signin">
          Olvidaste tu contraseña? <a href="#">Restablecela</a>{" "}
        </p>
      </form>
    </div>
  );
};

export default Login;
