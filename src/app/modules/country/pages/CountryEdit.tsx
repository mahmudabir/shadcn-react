import { Country } from "@/app/modules/country-tanstack/models/country.ts";
import { toastError, toastSuccess } from "@/lib/toasterUtils.tsx";
import { useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from "@/components/ui/card.tsx";
import { COUNTRY_PATHS } from "@/app/modules/country/routes/CountryRoutes.tsx";
import { useCountries } from '@/app/modules/country/viewModels/use-countries.ts';
import CountryForm from "@/app/modules/country/components/CountryForm.tsx";

const CountryEdit = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const countryViewModel = useCountries();

    useEffect(() => {
        if (!id) return;
        countryViewModel.getById(id, { skipPreloader: false, queryKey: "country_by_id" });

        return () => {
            countryViewModel.cancelRequest("country_by_id");
        };
    }, [id]);

    const handleEdit = useCallback(async (data: Country) => {
        if (!id || !data.id) return;
        try {
            const result = await countryViewModel.update(id, data);
            if (result?.isSuccess) {
                toastSuccess(result?.message || 'Updated successfully');
                navigate(COUNTRY_PATHS.index());
            } else {
                toastError(result?.message || 'Failed to update country');
            }
        } catch (err: any) {
            toastError(err?.message || 'Failed to update country');
        }
    }, [id, countryViewModel, navigate]); // Using useCallback to memoize the method with dependencies => [id, countryViewModel, navigate]

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
