import { toastError, toastSuccess } from "@/lib/toasterUtils.tsx";
import { useNavigate } from 'react-router-dom';
import CountryForm from '../components/CityForm.tsx';
import { City } from "../../city/models/city.ts";
import { useCities } from "../viewModels/use-cities.ts";

const CityCreate = () => {
  const navigate = useNavigate();
  const { create } = useCities();

  const handleCreate = async (data: City) => {
    try {
      const result = await create.mutateAsync(data);
      if (create?.isSuccess || result?.isSuccess) {
        toastSuccess(result?.message || 'Added successfully');
        // navigate(COUNTRY_PATHS.index());
      } else {
        toastError(result?.message || 'Failed to create city');
      }
    } catch (err: any) {
      toastError(err?.message || 'Failed to create city');
    }
  };

  return (
    <CountryForm onSubmit={handleCreate} submitLabel="Create" />
  );
};

export default CityCreate;
