import { RouteItem } from "@/types/route.ts";
import { Route, Routes } from "react-router-dom";
import SuspenseWithFallback from "@/components/custom/suspense-with-fallback.tsx";


export default function CreateRoutes({ routesList }: { routesList: RouteItem[][] }) {
  return (
    (routesList && routesList.length > 0 && routesList.some(x => x.length > 0)) &&
    <Routes>
      {routesList.map((routes, idx1) => (
        routes.map((route, idx2) => (
          <Route key={route.path + idx1 + idx2} path={route.path}
                 element={<SuspenseWithFallback children={route.element}/>}/>
        ))
      ))}
    </Routes>
  );
}