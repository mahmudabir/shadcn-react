import { createBrowserRouter, createRoutesFromElements, Navigate, Route } from "react-router-dom"
import MainLayout from "@/components/layout/MainLayout"
import Login from "@/app/modules/auth/pages/Login.tsx"
import Dashboard from "@/app/modules/dashboard/pages/Dashboard.tsx"
import NotFound from "@/pages/NotFound"
import ProtectedRoute from "../app/core/guards/ProtectedRoute.tsx"
import { DASHBOARD_ROUTES } from "@/app/modules/dashboard/routes/dashboard-route-elements.ts";
import { CountryRoutes } from "@/app/modules/country/routes/CountryRoutes.tsx";

export const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route path="/login" element={<Login className=""/>}/>
            <Route element={<MainLayout/>}>

                {/* Protected Routes */}
                <Route element={<ProtectedRoute/>}>

                    <Route path={DASHBOARD_ROUTES.index()}>
                        <Route index element={<Dashboard />} />
                        <Route path={DASHBOARD_ROUTES.dashboard()} element={<Dashboard/>}/>
                    </Route>

                    {CountryRoutes}

                </Route>

                {/* Redirect to home page */}
                <Route path="/home" element={<Navigate to="/" replace/>}/>

                {/* 404 Not Found */}
                <Route path="*" element={<NotFound/>}/>
            </Route>
        </>
    )
)
