import { Navigate, Outlet } from "react-router-dom";
import { useAppStore } from "../store/appStore";

export function PrivateRoute() {
    const { authToken, tokenReady } = useAppStore();

    if ((!authToken || authToken === "") && tokenReady) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
