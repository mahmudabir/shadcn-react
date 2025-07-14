import { Route } from "react-router-dom";
import { COUNTRY_PATHS } from "@/app/modules/country/routes/country-paths.ts";
import CountryCreate from "../pages/CountryCreate";
import CountryList from "@/app/modules/country/pages/CountryList.tsx";
import CountryEdit from "@/app/modules/country/pages/CountryEdit.tsx";
import CountryDetails from "@/app/modules/country/pages/CountryDetails.tsx";

export const CountryRoutes = (
    <Route path={COUNTRY_PATHS.index()}>
        <Route index element={<CountryList />} />
        <Route path={COUNTRY_PATHS.create()} element={<CountryCreate />} />
        <Route path={COUNTRY_PATHS.edit()} element={<CountryEdit />} />
        <Route path={COUNTRY_PATHS.details()} element={<CountryDetails />} />
    </Route>
);