import { toastError, toastSuccess } from "@/lib/toasterUtils.tsx";
import { useNavigate } from 'react-router-dom';
import { useCities } from '../viewModels/use-cities.ts';
import CountryForm from '../components/CityForm.tsx';
import { City } from "@/app/modules/city-tanstack/models/city.ts";
import { CITY_PATHS } from "../routes/CityRoutes.tsx";
import { useCallback } from "react";

const CityCreate = () => {
  const navigate = useNavigate();
  const cityViewModel = useCities();

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

  return (
    <CountryForm onSubmit={handleCreate} submitLabel="Create" />
  );
};

export default CityCreate;
