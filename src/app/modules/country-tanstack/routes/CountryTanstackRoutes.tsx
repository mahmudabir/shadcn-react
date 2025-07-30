import { Route } from "react-router-dom";
import CountryCreate from "../pages/CountryCreate.tsx";
import CountryDetails from "../pages/CountryDetails.tsx";
import CountryEdit from "../pages/CountryEdit.tsx";
import CountryList from "../pages/CountryList.tsx";

// eslint-disable-next-line react-refresh/only-export-components
export const COUNTRY_TANSTACK_PATHS = {
    index: () => '/countries-tanstack',
    create: () => '/countries-tanstack/create',
    edit: (id: string = ':id') => `/countries-tanstack/${id}/edit`,
    details: (id: string = ':id') => `/countries-tanstack/${id}`,
};

export const CountryTanstackRoutes = (
    <Route path={COUNTRY_TANSTACK_PATHS.index()}>
        <Route index element={<CountryList />} />
        <Route path={COUNTRY_TANSTACK_PATHS.create()} element={<CountryCreate />} />
        <Route path={COUNTRY_TANSTACK_PATHS.edit()} element={<CountryEdit />} />
        <Route path={COUNTRY_TANSTACK_PATHS.details()} element={<CountryDetails />} />
    </Route>
);