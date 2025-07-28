import { toastError, toastSuccess } from "@/lib/toasterUtils.tsx";
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CountryForm from '../components/CountryForm.tsx';
import type { Country } from '../models/country.ts';
import { useCountries } from '../viewModels/use-countries.ts';

const CountryEdit = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const countryViewModel = useCountries();

    useEffect(() => {
        if (!id) return;
        countryViewModel.getById(id);
    }, [id]);

    const handleEdit = async (data: Country) => {
        if (!id || !data.id) return;
        try {
            await countryViewModel.update(id, data);
            if (countryViewModel.isUpdateSuccess.current) {
                toastSuccess(countryViewModel.message || 'Updated successfully');
                // navigate(COUNTRY_PATHS.index());
            } else {
                toastError(countryViewModel.message || 'Failed to update country');
            }
        } catch (err: any) {
            toastError(err.message || 'Failed to update country');
        }
    };

    if (countryViewModel.isLoading) return <div>Loading...</div>;
    if (!countryViewModel.item?.isSuccess) return <div>Country not found</div>;

    return (
        <CountryForm initialData={countryViewModel.item?.payload} onSubmit={handleEdit} submitLabel="Update" />
    );
};

export default CountryEdit;
