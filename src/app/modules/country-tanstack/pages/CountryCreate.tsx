import { Country } from "@/app/modules/country-tanstack/models/country.ts";
import { toastError, toastSuccess } from "@/lib/toasterUtils.tsx";
import { useNavigate } from 'react-router-dom';
import CountryForm from '../components/CountryForm.tsx';
import { COUNTRY_TANSTACK_PATHS } from "../routes/CountryTanstackRoutes.tsx";
import { useCountries } from "../viewModels/use-countries.ts";
import { useCallback } from "react";

const CountryCreate = () => {
  const navigate = useNavigate();
  const { create } = useCountries();
  const createMutation = create();

  const handleCreate = useCallback(async (data: Country) => {
    try {
      const result = await createMutation.mutateAsync(data);
      if (createMutation?.isSuccess || result?.isSuccess) {
        toastSuccess(result?.message || 'Added successfully');
        navigate(COUNTRY_TANSTACK_PATHS.index());
      } else {
        toastError(result?.message || 'Failed to create country');
      }
    } catch (err: any) {
      toastError(err?.message || 'Failed to create country');
    }
  }, [createMutation, navigate]); // Using useCallback to memoize the method with dependencies => [createMutation, navigate]

  return (
    <CountryForm onSubmit={handleCreate} submitLabel="Create" />
  );
};

export default CountryCreate;
