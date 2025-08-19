import { lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { CITY_TANSTACK_PATHS } from "@/app/modules/city-tanstack/routes/index.ts";
import { RouteLoader } from "@/components/custom/route-loader.tsx";
import SuspenseWithFallback from "@/components/custom/suspense-with-fallback.tsx";

const CityList = lazy(() => import("@/app/modules/city-tanstack/pages/CityList"));
const CityCreate = lazy(() => import("@/app/modules/city-tanstack/pages/CityCreate"));
const CityEdit = lazy(() => import("@/app/modules/city-tanstack/pages/CityEdit"));
const CityDetails = lazy(() => import("@/app/modules/city-tanstack/pages/CityDetails"));

export default function CityTanstackRoutes() {

  const { pathname } = useLocation();

  return (
    <Routes>
      <Route path={CITY_TANSTACK_PATHS.index()} element={<SuspenseWithFallback children={<CityList/>}/>}/>
      <Route path={CITY_TANSTACK_PATHS.create()} element={<SuspenseWithFallback children={<CityCreate/>}/>}/>
      <Route path={CITY_TANSTACK_PATHS.edit()} element={<SuspenseWithFallback children={<CityEdit/>}/>}/>
      <Route path={CITY_TANSTACK_PATHS.details()} element={<SuspenseWithFallback children={<CityDetails/>}/>}/>
    </Routes>
  );
}