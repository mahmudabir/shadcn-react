import { Route } from "react-router-dom";
import CityList from "@/app/modules/city-tanstack/pages/CityList.tsx";
import CityCreate from "@/app/modules/city-tanstack/pages/CityCreate.tsx";
import CityEdit from "@/app/modules/city-tanstack/pages/CityEdit.tsx";
import CityDetails from "@/app/modules/city-tanstack/pages/CityDetails.tsx";

// eslint-disable-next-line react-refresh/only-export-components
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