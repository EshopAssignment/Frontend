import { useMe } from "@/queries/auth";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function RequireAdmin() {
    const {data, isLoading} = useMe();
    const loc = useLocation();
    if (isLoading) return null;
    if (!data) return <Navigate to="/auth/login" replace state ={{from:loc}} />
    if (!data.roles?.includes("Admin")) return <Navigate to="/" replace state ={{from:loc}} />
    return <Outlet />;
}