import { Navigate, Outlet } from "react-router-dom";
import { useAppStore } from "../store/appStore";

export function PrivateRoute() {
    const { authToken } = useAppStore();

    if (!authToken || authToken === "") {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
