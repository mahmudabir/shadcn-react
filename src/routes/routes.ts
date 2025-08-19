import { RouteItem } from "@/types/route.ts";
import { CountryTanstackRoutes } from "@/app/modules/country-tanstack/routes/CountryTanstackRoutes.tsx";
import { CityTanstackRoutes } from "@/app/modules/city-tanstack/routes/CityTanstackRoutes.tsx";

export const routesList: RouteItem[][] = [
  CountryTanstackRoutes,
  CityTanstackRoutes
];