import { FC, ReactNode, useState } from "react";
import "./layout.css";
import { LoaderScreen } from "../Loader/LoaderScreen";

type Props = {
  children: ReactNode;
  loading?: boolean;
};

export const Layout: FC<Props> = ({ children, loading = false }) => {
  const [title, setTitle] = useState<string>("section1");
  const [isAsideOpen, setIsAsideOpen] = useState<boolean>(false);
  return (
    <div className="layout">
      <div className="content">
        <header>
          <label className="burger" htmlFor="burger">
            <input
              type="checkbox"
              id="burger"
              onChange={() => setIsAsideOpen(!isAsideOpen)}
            />
            <span></span>
            <span></span>
            <span></span>
          </label>
          <h1>{title}</h1>
        </header>
        <div className="main-content">
          <aside className={isAsideOpen ? "open" : "closed"}>
            <ul>
              <li>
                <span>seccion1</span>
              </li>
              <li>
                <span>seccion2</span>
              </li>
              <li>
                <span>seccion3</span>
              </li>
            </ul>
          </aside>
          <main>{loading ? <LoaderScreen /> : <>{children}</>}</main>
        </div>
      </div>
    </div>
  );
};
