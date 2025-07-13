import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getCountryById } from './api/countries.ts';
import type { Country } from './models/country.ts';
import { ROUTES } from "@/app/core/routes/routes.ts";

const CountryDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [country, setCountry] = useState<Country | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    getCountryById(id)
      .then(data => setCountry(data.payload))
      .catch(err => setError(err.message || 'Failed to fetch country'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!country) return <div>Country not found</div>;

  return (
    <div>
      <h2>Country Details</h2>
      <p><strong>Name (English):</strong> {country.nameEn}</p>
      <p><strong>Name (Bangla):</strong> {country.nameBn}</p>
      <p><strong>Name (Arabic):</strong> {country.nameAr}</p>
      <p><strong>Name (Hindi):</strong> {country.nameHi}</p>
      <Link to={ROUTES.countryEdit(country.id.toString())}>Edit</Link>
      {' | '}
      <Link to={ROUTES.countries}>Back to List</Link>
    </div>
  );
};

export default CountryDetails;
