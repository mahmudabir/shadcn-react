import { COUNTRY_PATHS } from "@/app/modules/country/routes/country-paths.ts";
import { toastError, toastSuccess } from "@/lib/toasterUtils.tsx";
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCountryById, updateCountry } from '../api/countries.ts';
import CountryForm from '../components/CountryForm.tsx';
import type { Country } from '../models/country.ts';

const CountryEdit = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [country, setCountry] = useState<Omit<Country, 'id'> | null>(null);

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

    const handleEdit = async (data: Country) => {
        if (!id || !data.id) return;
        try {
            const result = await updateCountry(id, data);
            if (result.isSuccess) {
                toastSuccess(result.message || 'Updated successfully')
                // navigate(COUNTRY_PATHS.index());
            }
        } catch (err: any) {
            toastError(err.message || 'Failed to update country');
        }
    };

    if (!country) return <div>Country not found</div>;

    return (
        <CountryForm initialData={country} onSubmit={handleEdit} submitLabel="Update" />
    );
};

export default CountryEdit;
