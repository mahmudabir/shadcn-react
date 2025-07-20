import { COUNTRY_PATHS } from "@/app/modules/country/routes/country-paths.ts";
import { toastError, toastSuccess } from "@/lib/toasterUtils.tsx";
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteCountry, getCountries } from '../api/countries.ts';
import type { Country } from '../models/country.ts';

const CountryList = () => {
  const [countries, setCountries] = useState<Country[]>([]);

  const fetchData = async () => {
    try {
      const data = await getCountries();
      if (data.isSuccess) {
        setCountries(data.payload.content || []);
      } else {
        toastError(data.message || 'Failed to fetch countries');
      }
    } catch (err) {
      toastError(err.message || 'Failed to fetch countries');
    } finally {
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this country?')) return;
    try {
      const result = await deleteCountry(id);
      if (result.isSuccess) {
        toastSuccess(result.message || 'Deleted successfully')
      }
      await fetchData();
    } catch (err) {
      toastError(err.message || 'Failed to delete country');
    }
  };

  return (
    <div>
      <h1>Countries</h1>
      <ul>
        {!countries?.length
          ? <h5>No countries found</h5>
          : countries.map(country => (
            <li key={country.id}>
              <Link to={COUNTRY_PATHS.details(country.id.toString())}>{country.nameEn}</Link>
              {' | '}
              <Link to={COUNTRY_PATHS.edit(country.id.toString())}>Edit</Link>
              {' | '}
              <button onClick={() => handleDelete(country.id.toString())} style={{ color: 'red' }}>Delete</button>
            </li>
          ))}
      </ul>
      <Link to={COUNTRY_PATHS.create()}>Create New Country</Link>
    </div>
  );
};

export default CountryList;
