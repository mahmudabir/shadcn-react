import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCountryById, updateCountry } from '../api/countries.ts';
import type { Country } from '../models/country.ts';
import CountryForm from '../components/CountryForm.tsx';
import { COUNTRY_PATHS } from "@/app/modules/country/routes/country-paths.ts";
import { toastError, toastSuccess } from "@/lib/toasterUtils.tsx";

const CountryEdit = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [initialData, setInitialData] = useState<Omit<Country, 'id'> | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        getCountryById(id)
            .then(data => {
                if (data.isSuccess) {
                    setInitialData(data.payload);
                } else {
                    toastError(data.message || 'Failed to fetch country');
                }
            })
            .catch(err => toastError(err.message || 'Failed to fetch country'))
            .finally(() => setLoading(false));
    }, [id]);

    const handleEdit = async (data: Country) => {
        if (!id) return;
        try {
            const result = await updateCountry(id, data);
            if (result.isSuccess) {
                toastSuccess(result.message || 'Updated successfully')
                navigate(COUNTRY_PATHS.index());
            }
        } catch (err: any) {
            toastError(err.message || 'Failed to update country');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!initialData) return <div>Country not found</div>;

    return (
        <div>
            <h2>Edit Country</h2>
            <CountryForm initialData={initialData} onSubmit={handleEdit} submitLabel="Update"/>
        </div>
    );
};

export default CountryEdit;
