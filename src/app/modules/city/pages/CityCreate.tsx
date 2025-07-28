import { toastError, toastSuccess } from "@/lib/toasterUtils.tsx";
import { useNavigate } from 'react-router-dom';
import { useCities } from '../viewModels/use-cities.ts';
import CountryForm from '../components/CityForm.tsx';
import { City } from "../models/city.ts";

const CountryCreate = () => {
  const navigate = useNavigate();
  const cityViewModel = useCities();

  const handleCreate = async (data: City) => {
    try {
      await cityViewModel.create(data);
      if (cityViewModel.isCreateSuccess.current) {
        toastSuccess(cityViewModel.message || 'Added successfully');
        // navigate(COUNTRY_PATHS.index());
      } else {
        toastError(cityViewModel.message || 'Failed to create city');
      }
    } catch (err: any) {
      toastError(err.message || 'Failed to create city');
    }
  };

  return (
    <CountryForm onSubmit={handleCreate} submitLabel="Create" />
  );
};

export default CountryCreate;
