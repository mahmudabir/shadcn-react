import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getCountryById } from '../api/countries.ts';
import type { Country } from '../models/country.ts';
import { COUNTRY_PATHS } from "@/app/modules/country/routes/country-paths.ts";
import { toastError } from "@/lib/toasterUtils.tsx";
import { Preloader } from '@/components/custom/preloader.tsx';

const CountryDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [country, setCountry] = useState<Country | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getCountryById(id)
      .then(data => setCountry(data.payload))
      .catch(err => toastError(err.message || 'Failed to fetch country'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Preloader/>;
  if (!country) return <div>Country not found</div>;

  return (
    <>
      <h2>Country Details</h2>
      <p><strong>Name (English):</strong> {country.nameEn}</p>
      <p><strong>Name (Bangla):</strong> {country.nameBn}</p>
      <p><strong>Name (Arabic):</strong> {country.nameAr}</p>
      <p><strong>Name (Hindi):</strong> {country.nameHi}</p>
      <Link to={COUNTRY_PATHS.edit(country.id.toString())}>Edit</Link>
      {' | '}
      <Link to={COUNTRY_PATHS.index()}>Back to List</Link>
    </>
  );
};

export default CountryDetails;
