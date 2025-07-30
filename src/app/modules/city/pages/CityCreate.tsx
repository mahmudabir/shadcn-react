import { toastError, toastSuccess } from "@/lib/toasterUtils.tsx";
import { useNavigate } from 'react-router-dom';
import { useCities } from '../viewModels/use-cities.ts';
import CountryForm from '../components/CityForm.tsx';
import { City } from "@/app/modules/city-tanstack/models/city.ts";

const CityCreate = () => {
  const navigate = useNavigate();
  const cityViewModel = useCities();

  const handleCreate = async (data: City) => {
    try {
      const result = await cityViewModel.create(data);
      if (result?.isSuccess) {
        toastSuccess(result?.message || 'Added successfully');
        // navigate(COUNTRY_PATHS.index());
      } else {
        toastError(result?.message || 'Failed to create city');
      }
    } catch (err: any) {
      toastError(err.message || 'Failed to create city');
    }
  };

  return (
    <CountryForm onSubmit={handleCreate} submitLabel="Create" />
  );
};

export default CityCreate;
