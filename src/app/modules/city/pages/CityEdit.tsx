import { toastError, toastSuccess } from "@/lib/toasterUtils.tsx";
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from "../../../../components/ui/card.tsx";
import { City } from "../../city-tanstack/models/city.ts";
import CityForm from '../components/CityForm.tsx';
import { useCities } from '../viewModels/use-cities.ts';
import { CITY_PATHS } from "../routes/CityRoutes.tsx";

const CityEdit = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const cityViewModel = useCities();

    useEffect(() => {
        if (!id) return;
        cityViewModel.getById(id);
    }, [id]);

    const handleEdit = async (data: City) => {
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
    };

    if (cityViewModel.isLoading) return (
        <div className="flex justify-center items-center h-40">Loading...</div>
    );

    if (!cityViewModel.item?.isSuccess) return (
        <Card className="p-6">
            <h2 className="text-xl font-bold mb-2">City not found</h2>
        </Card>
    );

    return (
        <CityForm initialData={cityViewModel.item?.payload} onSubmit={handleEdit} submitLabel="Update" />
    );
};

export default CityEdit;
