import { toastError, toastSuccess } from "@/lib/toasterUtils.tsx";
import { useNavigate } from 'react-router-dom';
import { useCountries } from '../viewModels/use-countries.ts';
import CountryForm from '../components/CountryForm.tsx';
import type { Country } from '../models/country.ts';

const CountryCreate = () => {
  const navigate = useNavigate();
  const countryViewModel = useCountries();

  const handleCreate = async (data: Country) => {
    try {
      const result = await countryViewModel.create(data);
      if (result?.isSuccess) {
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
