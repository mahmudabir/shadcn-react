import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useCities } from '@/app/modules/city/viewModels/use-cities.ts';
import { CITY_PATHS } from "@/app/modules/city/routes/CityRoutes.tsx";

const CityDetails = () => {
  const params = useParams<{ id: string }>();
  const cityViewModel = useCities();

  useEffect(() => {
    if (!params.id) return;
    cityViewModel.getById(params.id);
  }, [params.id]);

  if (cityViewModel.isLoading) return (
    <div className="flex justify-center items-center h-40">Loading...</div>
  );

  if (!cityViewModel.item?.isSuccess) return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-2">City not found</h2>
    </Card>
  );

  return (
    <Card className="max-w-xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-6">City Details</h2>
      <div className="grid grid-cols-1 gap-4 mb-6">
        <div>
          <span className="font-semibold">Name (English): </span>
          <span>{cityViewModel.item.payload.nameEn}</span>
        </div>
        <div>
          <span className="font-semibold">Name (Bangla): </span>
          <span>{cityViewModel.item.payload.nameBn}</span>
        </div>
        <div>
          <span className="font-semibold">Name (Arabic): </span>
          <span>{cityViewModel.item.payload.nameAr}</span>
        </div>
        <div>
          <span className="font-semibold">Name (Hindi): </span>
          <span>{cityViewModel.item.payload.nameHi}</span>
        </div>
      </div>
      <div className="flex gap-2">
        <Button asChild variant="secondary">
          <Link to={CITY_PATHS.edit(cityViewModel.item?.payload?.id.toString())}>Edit</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to={CITY_PATHS.index()}>Back to List</Link>
        </Button>
      </div>
    </Card>
  );
};

export default CityDetails;
