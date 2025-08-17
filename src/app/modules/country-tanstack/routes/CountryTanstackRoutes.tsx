import { Route } from "react-router-dom";
import CountryList from "@/app/modules/country-tanstack/pages/CountryList.tsx";
import CountryCreate from "@/app/modules/country-tanstack/pages/CountryCreate.tsx";
import CountryEdit from "@/app/modules/country-tanstack/pages/CountryEdit.tsx";
import CountryDetails from "@/app/modules/country-tanstack/pages/CountryDetails.tsx";

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