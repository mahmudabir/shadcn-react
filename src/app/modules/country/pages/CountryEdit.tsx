import { toastError, toastSuccess } from "@/lib/toasterUtils.tsx";
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CountryForm from '../components/CountryForm.tsx';
import type { Country } from '../models/country.ts';
import { useCountries } from '../viewModels/use-countries.ts';
import { Card } from "../../../../components/ui/card.tsx";

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
            const result = await countryViewModel.update(id, data);
            if (result?.isSuccess) {
                toastSuccess(result?.message || 'Updated successfully');
                // navigate(COUNTRY_PATHS.index());
            } else {
                toastError(result?.message || 'Failed to update country');
            }
        } catch (err: any) {
            toastError(err?.message || 'Failed to update country');
        }
    };

    if (countryViewModel.isLoading) return (
        <div className="flex justify-center items-center h-40">Loading...</div>
    );

    if (!countryViewModel.item?.isSuccess) return (
        <Card className="p-6">
            <h2 className="text-xl font-bold mb-2">Country not found</h2>
        </Card>
    );

    return (
        <CountryForm initialData={countryViewModel.item?.payload} onSubmit={handleEdit} submitLabel="Update" />
    );
};

export default CountryEdit;
