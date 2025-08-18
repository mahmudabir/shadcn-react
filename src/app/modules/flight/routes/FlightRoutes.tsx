import { Route } from "react-router-dom";
import FlightList from "@/app/modules/flight/pages/FlightList.tsx";

// eslint-disable-next-line react-refresh/only-export-components
export const FLIGHT_PATHS = {
    index: () => '/flights'
};

export const FLightRoutes = (
    <Route path={FLIGHT_PATHS.index()}>
        <Route index element={<FlightList />} />
    </Route>
);