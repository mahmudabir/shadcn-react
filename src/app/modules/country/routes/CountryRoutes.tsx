import { Route } from "react-router-dom";
import { COUNTRY_ROUTES } from "@/app/modules/country/routes/country-route-elements.ts";
import CountryCreate from "../pages/CountryCreate";
import CountryList from "@/app/modules/country/pages/CountryList.tsx";
import CountryEdit from "@/app/modules/country/pages/CountryEdit.tsx";
import CountryDetails from "@/app/modules/country/pages/CountryDetails.tsx";

export const CountryRoutes = (
    <Route path={COUNTRY_ROUTES.index()}>
        <Route index element={<CountryList />} />
        <Route path={COUNTRY_ROUTES.create()} element={<CountryCreate />} />
        <Route path={COUNTRY_ROUTES.edit()} element={<CountryEdit />} />
        <Route path={COUNTRY_ROUTES.details()} element={<CountryDetails />} />
    </Route>
);