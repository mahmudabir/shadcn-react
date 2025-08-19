import { Route, Routes } from "react-router-dom";
import { COUNTRY_TANSTACK_PATHS } from "@/app/modules/country-tanstack/routes/index.ts";
import { JSX, lazy } from "react";
import SuspenseWithFallback from "@/components/custom/suspense-with-fallback.tsx";
import { RouteItem } from "@/types/route.ts";

const CountryList = lazy(() => import("@/app/modules/country-tanstack/pages/CountryList.tsx"));
const CountryCreate = lazy(() => import("@/app/modules/country-tanstack/pages/CountryCreate.tsx"));
const CountryEdit = lazy(() => import("@/app/modules/country-tanstack/pages/CountryEdit.tsx"));
const CountryDetails = lazy(() => import("@/app/modules/country-tanstack/pages/CountryDetails.tsx"));

export default function CountryTanstackRoutes() {

  const routes: RouteItem[] = [
    {
      path: COUNTRY_TANSTACK_PATHS.index(),
      element: <CountryList/>
    },
    {
      path: COUNTRY_TANSTACK_PATHS.create(),
      element: <CountryCreate/>
    },
    {
      path: COUNTRY_TANSTACK_PATHS.edit(),
      element: <CountryEdit/>
    },
    {
      path: COUNTRY_TANSTACK_PATHS.details(),
      element: <CountryDetails/>
    }
  ];

  return (
    <Routes>
      {routes.map((route, index) => (
        <Route key={index} path={route.path} element={<SuspenseWithFallback children={route.element}/>}/>
      ))}
    </Routes>
  );
}