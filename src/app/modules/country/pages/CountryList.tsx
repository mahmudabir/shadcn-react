import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteCountry, getCountries } from '../api/countries.ts';
import type { Country } from '../models/country.ts';
import { COUNTRY_ROUTES } from "@/app/modules/country/routes/country-route-elements.ts";

const CountryList= () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (loading: boolean = true) => {
    setLoading(loading);
    setError(null);
    try {
      const data = await getCountries();
      if (data.isSuccess) {
        setCountries(data.payload.content || []);
      } else {
        setError(data.message || 'Failed to fetch countries');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch countries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this country?')) return;
    try {
      await deleteCountry(id);
      await fetchData(false);
    } catch (err) {
      setError(err.message || 'Failed to delete country');
    }
  };

  if (loading) return <div>Loading countries...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <h1>Countries</h1>
      <ul>
        {!countries?.length 
        ? <h5>No countries found</h5>
        : countries.map(country => (
          <li key={country.id}>
            <Link to={COUNTRY_ROUTES.details(country.id.toString())}>{country.nameEn}</Link>
            {' | '}
            <Link to={COUNTRY_ROUTES.edit(country.id.toString())}>Edit</Link>
            {' | '}
            <button onClick={() => handleDelete(country.id.toString())} style={{ color: 'red' }}>Delete</button>
          </li>
        ))}
      </ul>
      <Link to={COUNTRY_ROUTES.create()}>Create New Country</Link>
    </div>
  );
};

export default CountryList;
