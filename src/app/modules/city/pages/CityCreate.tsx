import { City } from "@/app/modules/city-tanstack/models/city.ts";
import { toastError, toastSuccess } from "@/lib/toasterUtils.tsx";
import { useCallback, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useCountries } from "../../country/viewModels/use-countries.ts";
import CountryForm from '../components/CityForm.tsx';
import { CITY_PATHS } from "../routes/CityRoutes.tsx";
import { useCities } from '../viewModels/use-cities.ts';

const CityCreate = () => {
  const navigate = useNavigate();
  const cityViewModel = useCities();
  const countryViewModel = useCountries();

  useEffect(() => {
    countryViewModel.getSelectItems("nameEn", "id", "Select a country", { skipPreloader: true, queryKey: "country_select_items" });
    return () => {
      countryViewModel.cancelRequest("country_select_items");
    };
  }, []);

  const handleCreate = useCallback(async (data: City) => {
    try {
      const result = await cityViewModel.create(data);
      if (result?.isSuccess) {
        toastSuccess(result?.message || 'Added successfully');
        navigate(CITY_PATHS.index());
      } else {
        toastError(result?.message || 'Failed to create city');
      }
    } catch (err: any) {
      toastError(err.message || 'Failed to create city');
    }
  }, [cityViewModel, navigate]); // Using useCallback to memoize the method with dependencies => [cityViewModel, navigate]

  if (countryViewModel.isLoading) return (
    <div className="flex justify-center items-center h-40">Loading...</div>
  );

  return (
    <CountryForm onSubmit={handleCreate} countryOptions={countryViewModel.selectItems} submitLabel="Create" />
  );
};

export default CityCreate;
