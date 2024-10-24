import "./loader.css";

export const Loader = ({ size = "70px" }) => {
  return (
    <div className="loader" style={{ "--size": size } as any}>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
};
