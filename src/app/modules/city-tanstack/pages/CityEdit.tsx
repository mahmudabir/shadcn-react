import { toastError, toastSuccess } from "@/lib/toasterUtils.tsx";
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from "../../../../components/ui/card.tsx";
import CityForm from '../components/CityForm.tsx';
import { City } from "../models/city.ts";
import { CITY_TANSTACK_PATHS } from "../routes/CityTanstackRoutes.tsx";
import { useCities } from "../viewModels/use-cities.ts";

const CityEdit = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { update, getById } = useCities();
    const updateMutation = update();

    const { data, isLoading, error, isSuccess } = getById(id);

    const handleEdit = async (data: City) => {
        if (!id || !data.id) return;
        try {
            const result = await updateMutation.mutateAsync({id, ...data});
            if (updateMutation?.isSuccess || result?.isSuccess) {
                toastSuccess(result?.message || 'Updated successfully');
                navigate(CITY_TANSTACK_PATHS.index());
            } else {
                toastError(result?.message || 'Failed to update city');
            }
        } catch (err: any) {
            toastError(err?.message || 'Failed to update city');
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

export default CityEdit;
