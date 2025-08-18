import { toastError, toastSuccess } from "@/lib/toasterUtils.tsx";
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from "@/components/ui/card.tsx";
import { City } from "@/app/modules/city-tanstack/models/city.ts";
import { CITY_TANSTACK_PATHS } from "@/app/modules/city-tanstack/routes";
import { useCities } from "@/app/modules/city-tanstack/viewModels/use-cities.ts";
import { useCallback } from "react";
import { useCountries } from "@/app/modules/country-tanstack/viewModels/use-countries.ts";
import CityForm from "@/app/modules/city-tanstack/components/CityForm.tsx";

const CityEdit = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { update, getById } = useCities();
    const updateMutation = update();

    const { getSelectItems } = useCountries();
    const countrySelectItems = getSelectItems("nameEn", "id", "Select a country");

    const { data, isLoading, error, isSuccess } = getById(id);

    const handleEdit = useCallback(async (data: City) => {
        if (!id || !data.id) return;
        try {
            const result = await updateMutation.mutateAsync({ id, ...data });
            if (updateMutation?.isSuccess || result?.isSuccess) {
                toastSuccess(result?.message || 'Updated successfully');
                navigate(CITY_TANSTACK_PATHS.index());
            } else {
                toastError(result?.message || 'Failed to update city');
            }
        } catch (err: any) {
            toastError(err?.message || 'Failed to update city');
        }
    }, [id, updateMutation, navigate]); // Using useCallback to memoize the method with dependencies => [id, updateMutation, navigate]

    if (isLoading || countrySelectItems.isLoading) return (
        <div className="flex justify-center items-center h-40">Loading...</div>
    );

    if (!isSuccess) return (
        <Card className="p-6">
            <h2 className="text-xl font-bold mb-2">City not found (Tanstack)</h2>
        </Card>
    );

    return (
        <CityForm initialData={data?.payload} countryOptions={countrySelectItems.data} onSubmit={handleEdit} submitLabel="Update" />
    );
};

export default CityEdit;
