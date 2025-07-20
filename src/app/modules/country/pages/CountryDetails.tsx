import { COUNTRY_PATHS } from "@/app/modules/country/routes/country-paths.ts";
import { toastError } from "@/lib/toasterUtils.tsx";
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getCountryById } from '../api/countries.ts';
import type { Country } from '../models/country.ts';

const CountryDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [country, setCountry] = useState<Country | null>(null);

      const fetchData = async (id: string) => {
        try {
            const data = await getCountryById(id);
            if (data.isSuccess) {
                setCountry(data.payload);
            } else {
                toastError(data.message || 'Failed to fetch country');
            }
        } catch (err) {
            toastError(err.message || 'Failed to fetch country');
        } finally {
        }
    };

  useEffect(() => {
    if (!id) return;
    fetchData(id);
  }, [id]);

  if (!country) return <h1>Country not found</h1>;

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
