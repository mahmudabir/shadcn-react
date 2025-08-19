import { toastError, toastSuccess } from "@/lib/toasterUtils.tsx";
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from "@/components/ui/card.tsx";
import { Country } from "@/app/modules/country-tanstack/models/country.ts";
import { COUNTRY_TANSTACK_PATHS } from "@/app/modules/country-tanstack/routes/index.ts";
import { useCountries } from "@/app/modules/country-tanstack/viewModels/use-countries.ts";
import { useCallback } from "react";
import CountryForm from "@/app/modules/country-tanstack/components/CountryForm.tsx";

const CountryEdit = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { update, getById } = useCountries();
    const updateMutation = update();

    const { data, isLoading, error, isSuccess } = getById(id);

    const handleEdit = useCallback(async (data: Country) => {
        if (!id || !data.id) return;
        try {
            const result = await updateMutation.mutateAsync({ id, ...data });
            if (updateMutation?.isSuccess || result?.isSuccess) {
                toastSuccess(result?.message || 'Updated successfully');
                navigate(COUNTRY_TANSTACK_PATHS.index());
            } else {
                toastError(result?.message || 'Failed to update country');
            }
        } catch (err: any) {
            toastError(err?.message || 'Failed to update country');
        }
    }, [id, updateMutation, navigate]); // Using useCallback to memoize the method with dependencies => [id, updateMutation, navigate]

    if (isLoading) return (
        <div className="flex justify-center items-center h-40">Loading...</div>
    );

    if (!isSuccess) return (
        <Card className="p-6">
            <h2 className="text-xl font-bold mb-2">Country not found (Tanstack)</h2>
        </Card>
    );

    return (
        <CountryForm initialData={data?.payload} onSubmit={handleEdit} submitLabel="Update" />
    );
};

export default CountryEdit;
