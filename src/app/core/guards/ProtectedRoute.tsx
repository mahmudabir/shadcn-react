import { useAuthToken } from "@/hooks/use-auth-token.ts"
import { Navigate, Outlet, useNavigate } from "react-router-dom"
import { useEffect } from "react";
import { setNavigateFunction } from "@/app/core/api/base-api.tsx";

export default function ProtectedRoute() {

    const navigate = useNavigate();

    useEffect(() => {
        setNavigateFunction(navigate);
    }, [navigate]);

    const [hasToken] = useAuthToken()

    if (!hasToken) {
        return <Navigate to="/login" replace/>
    }

    return <Outlet/>
}
