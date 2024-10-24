import { Loader } from ".";
import "./loader.css";

export const LoaderScreen = () => {
  return (
    <div className="loader-screen">
      <Loader size="70px" />
    </div>
  );
};
