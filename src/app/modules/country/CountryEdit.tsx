import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCountryById, updateCountry } from './api/countries.ts';
import type { Country } from './models/country.ts';
import CountryForm from './CountryForm.tsx';
import { ROUTES } from "@/app/core/routes/routes.ts";

const CountryEdit = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [initialData, setInitialData] = useState<Omit<Country, 'id'> | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        setError(null);
        getCountryById(id)
            .then(data => {
                if (data.isSuccess) {
                    setInitialData(data.payload);
                } else {
                    setError(data.message || 'Failed to fetch country');
                }
            })
            .catch(err => setError(err.message || 'Failed to fetch country'))
            .finally(() => setLoading(false));
    }, [id]);

    const handleEdit = async (data: Country) => {
        if (!id) return;
        setError(null);
        try {
            await updateCountry(id, data);
            navigate(ROUTES.countries);
        } catch (err: any) {
            setError(err.message || 'Failed to update country');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;
    if (!initialData) return <div>Country not found</div>;

    return (
        <div>
            <h2>Edit Country</h2>
            <CountryForm initialData={initialData} onSubmit={handleEdit} submitLabel="Update" />
        </div>
    );
};

export default CountryEdit;
