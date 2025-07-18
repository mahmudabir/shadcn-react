import { useNavigate } from 'react-router-dom';
import { createCountry } from '../api/countries.ts';
import CountryForm from '../components/CountryForm.tsx';
import type { Country } from '../models/country.ts';
import { COUNTRY_PATHS } from "@/app/modules/country/routes/country-paths.ts";
import { toastError, toastSuccess } from "@/lib/toasterUtils.tsx";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../../../components/ui/card.tsx';
import { Car } from 'lucide-react';
import { Button } from '../../../../components/ui/button.tsx';

const CountryCreate = () => {
  const navigate = useNavigate();
  const handleCreate = async (data: Country) => {
    try {
      const result = await createCountry(data);
      if (result.isSuccess) {
        toastSuccess(result.message || 'Added successfully')
        navigate(COUNTRY_PATHS.index());
      }
    } catch (err) {
      toastError(err.message || 'Failed to create country');
    }
  };

  return (
    <CountryForm onSubmit={handleCreate} submitLabel="Create" />
  );
};

export default CountryCreate;
