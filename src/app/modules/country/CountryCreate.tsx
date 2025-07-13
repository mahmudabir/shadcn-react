import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCountry } from './api/countries.ts';
import CountryForm from './CountryForm.tsx';
import type { Country } from './models/country.ts';
import { ROUTES } from "@/app/core/routes/routes.ts";

const CountryCreate = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const handleCreate = async (data: Country) => {
    setError(null);
    try {
      await createCountry(data);
      navigate(ROUTES.countries);
    } catch (err) {
      setError(err.message || 'Failed to create country');
    }
  };

  return (
    <div>
      <h2>Create Country</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <CountryForm onSubmit={handleCreate} submitLabel="Create" />
    </div>
  );
};

export default CountryCreate;
