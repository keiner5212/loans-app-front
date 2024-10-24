import "./auth.css";
import { init } from "../../assets/animations/background/index";
import { useEffect, useRef } from "react";

const Login = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (canvasRef.current) init();
  }, [canvasRef]);
  return (
    <div className="layout">
      <canvas id="demo-canvas" ref={canvasRef}></canvas>
      <form className="form">
        <p className="title">Login </p>
        <p className="message">Login now to get access. </p>
        <div className="flex">
          <label>
            <input required placeholder="" type="text" className="input" />
            <span>Firstname</span>
          </label>

          <label>
            <input required placeholder="" type="text" className="input" />
            <span>Lastname</span>
          </label>
        </div>

        <label>
          <input required placeholder="" type="email" className="input" />
          <span>Email</span>
        </label>

        <label>
          <input required placeholder="" type="password" className="input" />
          <span>Password</span>
        </label>
        <label>
          <input required placeholder="" type="password" className="input" />
          <span>Confirm password</span>
        </label>
        <button className="submit">Submit</button>
        <p className="signin">
          Forgot password? <a href="#">Click here</a>{" "}
        </p>
      </form>
    </div>
  );
};

export default Login;
