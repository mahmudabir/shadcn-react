import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { CITY_TANSTACK_PATHS } from "@/app/modules/city-tanstack/routes/index.ts";
import { RouteLoader } from "@/components/custom/route-loader.tsx";

// Lazy imports
const CityList = lazy(() => import("@/app/modules/city-tanstack/pages/CityList"));
const CityCreate = lazy(() => import("@/app/modules/city-tanstack/pages/CityCreate"));
const CityEdit = lazy(() => import("@/app/modules/city-tanstack/pages/CityEdit"));
const CityDetails = lazy(() => import("@/app/modules/city-tanstack/pages/CityDetails"));

export default function CityTanstackRoutes() {
  return (
    <Routes>
      <Route path={CITY_TANSTACK_PATHS.index()} element={<Suspense fallback={<RouteLoader text={"CityList"}/>}>
        <CityList/>
      </Suspense>
      }/>
      <Route path={CITY_TANSTACK_PATHS.create()} element={<Suspense fallback={<RouteLoader text={"CityCreate"}/>}>
        <CityCreate/>
      </Suspense>
      }/>
      <Route path={CITY_TANSTACK_PATHS.edit()} element={<Suspense fallback={<RouteLoader text={"CityEdit"}/>}>
        <CityEdit/>
      </Suspense>
      }/>
      <Route path={CITY_TANSTACK_PATHS.details()} element={<Suspense fallback={<RouteLoader text={"CityDetails"}/>}>
        <CityDetails/>
      </Suspense>
      }/>
    </Routes>
  );
}