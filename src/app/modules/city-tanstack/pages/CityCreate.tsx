import { City } from "@/app/modules/city-tanstack/models/city.ts";
import { toastError, toastSuccess } from "@/lib/toasterUtils.tsx";
import { useNavigate } from 'react-router-dom';
import CountryForm from '../components/CityForm.tsx';
import { CITY_TANSTACK_PATHS } from "../routes/CityTanstackRoutes.tsx";
import { useCities } from "../viewModels/use-cities.ts";
import { useCallback } from "react";
import { useCountries } from "../../country-tanstack/viewModels/use-countries.ts";

const CityCreate = () => {
  const navigate = useNavigate();
  const { create } = useCities();
  const createMutation = create();

  const { getSelectItems } = useCountries();
  const countrySelectItems = getSelectItems("nameEn", "id", "Select a country");

  const handleCreate = useCallback(async (data: City) => {
    try {
      const result = await createMutation.mutateAsync(data);
      if (createMutation?.isSuccess || result?.isSuccess) {
        toastSuccess(result?.message || 'Added successfully');
        navigate(CITY_TANSTACK_PATHS.index());
      } else {
        toastError(result?.message || 'Failed to create city');
      }
    } catch (err: any) {
      toastError(err?.message || 'Failed to create city');
    }
  }, [createMutation, navigate]); // Using useCallback to memoize the method with dependencies => [createMutation, navigate]

    if (countrySelectItems.isLoading) return (
        <div className="flex justify-center items-center h-40">Loading...</div>
    );

  return (
    <CountryForm countryOptions={countrySelectItems.data} onSubmit={handleCreate} submitLabel="Create" />
  );
};

export default CityCreate;
