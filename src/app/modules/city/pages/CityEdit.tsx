import { toastError, toastSuccess } from "@/lib/toasterUtils.tsx";
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from "@/components/ui/card.tsx";
import { City } from "@/app/modules/city-tanstack/models/city.ts";
import { useCities } from '@/app/modules/city/viewModels/use-cities.ts';
import { CITY_PATHS } from "@/app/modules/city/routes/CityRoutes.tsx";
import { useCountries } from "@/app/modules/country/viewModels/use-countries.ts";
import CityForm from "@/app/modules/city/components/CityForm.tsx";

const CityEdit = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const cityViewModel = useCities();
    const countryViewModel = useCountries();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        countryViewModel.getSelectItems("nameEn", "id", "Select a country", { skipPreloader: false, queryKey: "country_select_items" });
        if (id) {
            cityViewModel.getById(id, { skipPreloader: false, queryKey: "city_by_id" });
        }
        return () => {
            countryViewModel.cancelRequest("country_select_items");
            cityViewModel.cancelRequest("city_by_id");
        };
    }, [id]);

    useEffect(() => {
        console.log('useEffect: ', new Date());
        console.log('useEffect: ', countryViewModel.isLoading);

        setIsLoading(countryViewModel.isLoading);
    }, [countryViewModel.isLoading]);

    const handleEdit = useCallback(async (data: City) => {
        if (!id || !data.id) return;
        try {
            const result = await cityViewModel.update(id, data);
            if (result?.isSuccess) {
                toastSuccess(result?.message || 'Updated successfully');
                navigate(CITY_PATHS.index());
            } else {
                toastError(result?.message || 'Failed to update city');
            }
        } catch (err: any) {
            toastError(err.message || 'Failed to update city');
        }
    }, [id, cityViewModel, navigate]); // Using useCallback to memoize the method with dependencies => [id, cityViewModel, navigate]

    if (isLoading) return (
        <div className="flex justify-center items-center h-40">Loading...</div>
    );

    if (!cityViewModel.item?.isSuccess) return (
        <Card className="p-6">
            <h2 className="text-xl font-bold mb-2">City not found</h2>
        </Card>
    );

    return <CityForm initialData={cityViewModel.item?.payload} countryOptions={countryViewModel.selectItems} onSubmit={handleEdit} submitLabel="Update" />;
};

export default CityEdit;
