import { lazy } from "react";
import { RouteItem } from "@/types/route.ts";
import { FLIGHT_PATHS } from "@/app/modules/flight/routes/paths.ts";

const FlightList = lazy(() => import("@/app/modules/flight/pages/FlightList.tsx"));

export const FlightRoutes: RouteItem[] = [
  {
    path: FLIGHT_PATHS.index(),
    element: <FlightList/>
  }
];
