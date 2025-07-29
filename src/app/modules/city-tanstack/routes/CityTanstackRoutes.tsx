import { Route } from "react-router-dom";
import CityCreate from "../pages/CityCreate";
import CityDetails from "../pages/CityDetails";
import CityEdit from "../pages/CityEdit";
import CityList from "../pages/CityList";

export const CITY_TANSTACK_PATHS = {
    index: () => '/cities-tanstack',
    create: () => '/cities-tanstack/create',
    edit: (id: string = ':id') => `/cities-tanstack/${id}/edit`,
    details: (id: string = ':id') => `/cities-tanstack/${id}`,
};

export const CityTanstackRoutes = (
    <Route path={CITY_TANSTACK_PATHS.index()}>
        <Route index element={<CityList />} />
        <Route path={CITY_TANSTACK_PATHS.create()} element={<CityCreate />} />
        <Route path={CITY_TANSTACK_PATHS.edit()} element={<CityEdit />} />
        <Route path={CITY_TANSTACK_PATHS.details()} element={<CityDetails />} />
    </Route>
);