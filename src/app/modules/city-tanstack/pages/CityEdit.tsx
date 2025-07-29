import { toastError, toastSuccess } from "@/lib/toasterUtils.tsx";
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CityForm from '../components/CityForm.tsx';
import { Card } from "../../../../components/ui/card.tsx";
import { City } from "../../city/models/city.ts";
import { useCities } from "../viewModels/use-cities.ts";

const cityEdit = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { update, getById } = useCities();

    const { data, isLoading, error, isSuccess } = getById(id);

    const handleEdit = async (data: City) => {
        if (!id || !data.id) return;
        try {
            await update.mutateAsync({id, ...data});
            if (update.isSuccess) {
                toastSuccess(update.data.message || 'Updated successfully');
                // navigate(city_PATHS.index());
            } else {
                toastError(update.data.message || 'Failed to update city');
            }
        } catch (err: any) {
            toastError(err.message || 'Failed to update city');
        }
    };

    if (isLoading) return (
        <div className="flex justify-center items-center h-40">Loading...</div>
    );

    if (!isSuccess) return (
        <Card className="p-6">
            <h2 className="text-xl font-bold mb-2">City not found (Tanstack)</h2>
        </Card>
    );

    return (
        <CityForm initialData={data?.payload} onSubmit={handleEdit} submitLabel="Update" />
    );
};

export default cityEdit;
