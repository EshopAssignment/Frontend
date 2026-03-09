import { useMe } from "@/hooks/Auth/useAuth";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function RequireAuth()  {
    const {data, isLoading} = useMe();
    const loc = useLocation();
    if (isLoading) return null;
    if (!data) return <Navigate to="/auth/login" replace state={{ from: loc }} />;
    return <Outlet/>;
}
