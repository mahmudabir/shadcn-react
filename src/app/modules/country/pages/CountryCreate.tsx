import { toastError, toastSuccess } from "@/lib/toasterUtils.tsx";
import { useNavigate } from 'react-router-dom';
import { useCountries } from '../viewModels/use-countries.ts';
import CountryForm from '../components/CountryForm.tsx';
import { Country } from "@/app/modules/country-tanstack/models/country.ts";
import { COUNTRY_PATHS } from "@/app/modules/country/routes/CountryRoutes.tsx";
import { useCallback } from "react";

const CountryCreate = () => {
  const navigate = useNavigate();
  const countryViewModel = useCountries();

  const handleCreate = useCallback(async (data: Country) => {
    try {
      const result = await countryViewModel.create(data);
      if (result?.isSuccess) {
        toastSuccess(result?.message || 'Added successfully');
        navigate(COUNTRY_PATHS.index());
      } else {
        toastError(result?.message || 'Failed to create country');
      }
    } catch (err: any) {
      toastError(err?.message || 'Failed to create country');
    }
  }, [countryViewModel, navigate]); // Using useCallback to memoize the method with dependencies => [countryViewModel, navigate]

  return (
    <CountryForm onSubmit={handleCreate} submitLabel="Create" />
  );
};

export default CountryCreate;
