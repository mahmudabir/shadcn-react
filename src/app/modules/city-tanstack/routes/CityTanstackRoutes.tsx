import { lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { CITY_TANSTACK_PATHS } from "@/app/modules/city-tanstack/routes/index.ts";
import { RouteLoader } from "@/components/custom/route-loader.tsx";

const CityList = lazy(() => import("@/app/modules/city-tanstack/pages/CityList"));
const CityCreate = lazy(() => import("@/app/modules/city-tanstack/pages/CityCreate"));
const CityEdit = lazy(() => import("@/app/modules/city-tanstack/pages/CityEdit"));
const CityDetails = lazy(() => import("@/app/modules/city-tanstack/pages/CityDetails"));

export default function CityTanstackRoutes() {

  const { pathname } = useLocation();

  return (
    <Routes>
      <Route path={CITY_TANSTACK_PATHS.index()} element={
        <Suspense fallback={<RouteLoader/>} key={pathname}>
          <CityList/>
        </Suspense>
      }/>
      <Route path={CITY_TANSTACK_PATHS.create()} element={
        <Suspense fallback={<RouteLoader/>} key={pathname}>
          <CityCreate/>
        </Suspense>
      }/>
      <Route path={CITY_TANSTACK_PATHS.edit()} element={
        <Suspense fallback={<RouteLoader/>} key={pathname}>
          <CityEdit/>
        </Suspense>
      }/>
      <Route path={CITY_TANSTACK_PATHS.details()} element={
        <Suspense fallback={<RouteLoader/>} key={pathname}>
          <CityDetails/>
        </Suspense>
      }/>
    </Routes>
  );
}