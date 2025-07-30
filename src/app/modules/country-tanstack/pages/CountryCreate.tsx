import { toastError, toastSuccess } from "@/lib/toasterUtils.tsx";
import { useNavigate } from 'react-router-dom';
import CountryForm from '../components/CountryForm.tsx';
import { useCountries } from "../viewModels/use-countries.ts";
import { Country } from "@/app/modules/country-tanstack/models/country.ts";

const CountryCreate = () => {
  const navigate = useNavigate();
  const { create } = useCountries();

  const handleCreate = async (data: Country) => {
    try {
      const result = await create.mutateAsync(data);
      if (create?.isSuccess || result?.isSuccess) {
        toastSuccess(result?.message || 'Added successfully');
        // navigate(COUNTRY_PATHS.index());
      } else {
        toastError(result?.message || 'Failed to create country');
      }
    } catch (err: any) {
      toastError(err?.message || 'Failed to create country');
    }
  };

  return (
    <CountryForm onSubmit={handleCreate} submitLabel="Create" />
  );
};

export default CountryCreate;
