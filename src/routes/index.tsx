import { createBrowserRouter, createRoutesFromElements, Navigate, Route } from "react-router-dom"
import AuthorizedLayout from "@/components/layout/AuthorizedLayout.tsx"
import Login from "@/app/modules/auth/pages/Login.tsx"
import Dashboard from "@/app/modules/dashboard/pages/Dashboard.tsx"
import NotFound from "@/pages/NotFound"
import ProtectedRoute from "../app/core/guards/ProtectedRoute.tsx"
import UnprotectedRoute from "@/app/core/guards/UnprotectedRoute.tsx"
import { BASE_PATHS } from "@/app/modules/dashboard/routes/dashboard-paths.ts"
import { AUTH_PATHS } from "@/app/modules/auth/routes/auth-paths.ts"
import { CountryRoutes } from "@/app/modules/country/routes/CountryRoutes.tsx"
import UnauthorizedLayout from "../components/layout/UnauthorizedLayout.tsx"

export const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            {/* Unprotected Routes */}
            <Route element={<UnprotectedRoute />}>
                <Route element={<UnauthorizedLayout />}>
                    <Route path={AUTH_PATHS.login()} element={<Login className="" />} />
                </Route>
            </Route>

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
                <Route element={<AuthorizedLayout />}>

                    <Route path={BASE_PATHS.index()}>
                        <Route index element={<Dashboard />} />
                        <Route path={BASE_PATHS.dashboard()} element={<Dashboard />} />
                    </Route>

                    {CountryRoutes}

                </Route>

                {/* Redirect to home page */}
                <Route path={BASE_PATHS.home()} element={<Navigate to="/" replace />} />
                <Route path={AUTH_PATHS.register()} element={<Navigate to={AUTH_PATHS.login()} replace />} />
            </Route>

            {/* 404 Not Found */}
            <Route path="*" element={<NotFound />} />
        </>
    )
)
