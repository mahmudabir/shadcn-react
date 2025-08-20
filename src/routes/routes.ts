import { RouteItem } from "@/types/route.ts";
import { CountryTanstackRoutes } from "@/app/modules/country-tanstack/routes/routes.tsx";
import { CityTanstackRoutes } from "@/app/modules/city-tanstack/routes/routes.tsx";
import { FlightRoutes } from "@/app/modules/flight/routes/routes.tsx";

export const routesList: RouteItem[][] = [
  CountryTanstackRoutes,
  CityTanstackRoutes,
  FlightRoutes
];