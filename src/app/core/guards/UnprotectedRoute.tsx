import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { setNavigateFunction } from "@/app/core/api/base-api.ts";
import { useAuthToken } from "@/hooks/use-auth-token.ts";
import { AUTH_PATHS } from "@/app/modules/auth/routes/auth-paths.ts";

export default function UnprotectedRoute() {

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        setNavigateFunction(navigate);
    }, [navigate]);

    const [hasToken] = useAuthToken()

    if (hasToken && (location.pathname === AUTH_PATHS.login() || location.pathname === AUTH_PATHS.register())) {
        return <Navigate to="/" replace/>
    }

    return <Outlet/>
}