import { Route } from "react-router-dom";
import CityList from "@/app/modules/city/pages/CityList.tsx";
import CityCreate from "@/app/modules/city/pages/CityCreate.tsx";
import CityEdit from "@/app/modules/city/pages/CityEdit.tsx";
import CityDetails from "@/app/modules/city/pages/CityDetails.tsx";

// eslint-disable-next-line react-refresh/only-export-components
export const CITY_PATHS = {
    index: () => '/cities',
    create: () => '/cities/create',
    edit: (id: string = ':id') => `/cities/${id}/edit`,
    details: (id: string = ':id') => `/cities/${id}`,
};

export const CityRoutes = (
    <Route path={CITY_PATHS.index()}>
        <Route index element={<CityList />} />
        <Route path={CITY_PATHS.create()} element={<CityCreate />} />
        <Route path={CITY_PATHS.edit()} element={<CityEdit />} />
        <Route path={CITY_PATHS.details()} element={<CityDetails />} />
    </Route>
);