import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCountry } from '../api/countries.ts';
import CountryForm from '../components/CountryForm.tsx';
import type { Country } from '../models/country.ts';
import { COUNTRY_PATHS } from "@/app/modules/country/routes/country-paths.ts";
import { toastError, toastSuccess } from "@/lib/toasterUtils.tsx";

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
    <div>
      <h2>Create Country</h2>
      <CountryForm onSubmit={handleCreate} submitLabel="Create" />
    </div>
  );
};

export default CountryCreate;
