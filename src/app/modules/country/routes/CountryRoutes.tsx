import { Route } from "react-router-dom";
import CountryCreate from "../pages/CountryCreate";
import CountryList from "@/app/modules/country/pages/CountryList.tsx";
import CountryEdit from "@/app/modules/country/pages/CountryEdit.tsx";
import CountryDetails from "@/app/modules/country/pages/CountryDetails.tsx";

// eslint-disable-next-line react-refresh/only-export-components
export const COUNTRY_PATHS = {
    index: () => '/countries',
    create: () => '/countries/create',
    edit: (id: string = ':id') => `/countries/${id}/edit`,
    details: (id: string = ':id') => `/countries/${id}`,
};

export const CountryRoutes = (
    <Route path={COUNTRY_PATHS.index()}>
        <Route index element={<CountryList />} />
        <Route path={COUNTRY_PATHS.create()} element={<CountryCreate />} />
        <Route path={COUNTRY_PATHS.edit()} element={<CountryEdit />} />
        <Route path={COUNTRY_PATHS.details()} element={<CountryDetails />} />
    </Route>
);