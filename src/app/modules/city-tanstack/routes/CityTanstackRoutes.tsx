import { lazy } from "react";
import { RouteItem } from "@/types/route.ts";
import { CITY_TANSTACK_PATHS } from "@/app/modules/city-tanstack/routes/index.ts";

const CityList = lazy(() => import("@/app/modules/city-tanstack/pages/CityList"));
const CityCreate = lazy(() => import("@/app/modules/city-tanstack/pages/CityCreate"));
const CityEdit = lazy(() => import("@/app/modules/city-tanstack/pages/CityEdit"));
const CityDetails = lazy(() => import("@/app/modules/city-tanstack/pages/CityDetails"));

export const CityTanstackRoutes: RouteItem[] = [
  {
    path: CITY_TANSTACK_PATHS.index(),
    element: <CityList/>
  },
  {
    path: CITY_TANSTACK_PATHS.create(),
    element: <CityCreate/>
  },
  {
    path: CITY_TANSTACK_PATHS.edit(),
    element: <CityEdit/>
  },
  {
    path: CITY_TANSTACK_PATHS.details(),
    element: <CityDetails/>
  }
];