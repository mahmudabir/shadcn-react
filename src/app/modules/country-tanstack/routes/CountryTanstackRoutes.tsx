import { Route, Routes } from "react-router-dom";
import { COUNTRY_TANSTACK_PATHS } from "@/app/modules/country-tanstack/routes/index.ts";
import { lazy } from "react";
import SuspenseWithFallback from "@/components/custom/suspense-with-fallback.tsx";

const CountryList = lazy(() => import("@/app/modules/country-tanstack/pages/CountryList.tsx"));
const CountryCreate = lazy(() => import("@/app/modules/country-tanstack/pages/CountryCreate.tsx"));
const CountryEdit = lazy(() => import("@/app/modules/country-tanstack/pages/CountryEdit.tsx"));
const CountryDetails = lazy(() => import("@/app/modules/country-tanstack/pages/CountryDetails.tsx"));

export default function CountryTanstackRoutes() {
  return (
    <Routes>
      <Route path={COUNTRY_TANSTACK_PATHS.index()} element={<SuspenseWithFallback children={<CountryList/>}/>}/>
      <Route path={COUNTRY_TANSTACK_PATHS.create()} element={<SuspenseWithFallback children={<CountryCreate/>}/>}/>
      <Route path={COUNTRY_TANSTACK_PATHS.edit()} element={<SuspenseWithFallback children={<CountryEdit/>}/>}/>
      <Route path={COUNTRY_TANSTACK_PATHS.details()} element={<SuspenseWithFallback children={<CountryDetails/>}/>}/>
    </Routes>
  );
}