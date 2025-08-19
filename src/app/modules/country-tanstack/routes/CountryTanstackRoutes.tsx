import { Route, Routes, useLocation } from "react-router-dom";
import { COUNTRY_TANSTACK_PATHS } from "@/app/modules/country-tanstack/routes/index.ts";
import { lazy, Suspense } from "react";
import { RouteLoader } from "@/components/custom/route-loader.tsx";

const CountryList = lazy(() => import("@/app/modules/country-tanstack/pages/CountryList.tsx"));
const CountryCreate = lazy(() => import("@/app/modules/country-tanstack/pages/CountryCreate.tsx"));
const CountryEdit = lazy(() => import("@/app/modules/country-tanstack/pages/CountryEdit.tsx"));
const CountryDetails = lazy(() => import("@/app/modules/country-tanstack/pages/CountryDetails.tsx"));

export default function CountryTanstackRoutes() {

  const { pathname } = useLocation();

  return (
    <Routes>
      <Route path={COUNTRY_TANSTACK_PATHS.index()} element={
               <Suspense fallback={<RouteLoader/>} key={pathname}>
                 <CountryList/>
               </Suspense>
             }/>
      <Route path={COUNTRY_TANSTACK_PATHS.create()} element={
        <Suspense fallback={<RouteLoader/>} key={pathname}>
          <CountryCreate/>
        </Suspense>
      }/>
      <Route path={COUNTRY_TANSTACK_PATHS.edit()} element={
        <Suspense fallback={<RouteLoader/>} key={pathname}>
          <CountryEdit/>
        </Suspense>
      }/>
      <Route path={COUNTRY_TANSTACK_PATHS.details()} element={
        <Suspense fallback={<RouteLoader/>} key={pathname}>
          <CountryDetails/>
        </Suspense>
      }/>
    </Routes>
  );
}