import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useCities } from "../viewModels/use-cities";
import { CITY_TANSTACK_PATHS } from "../routes/CityTanstackRoutes";

const CityDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { getById } = useCities();
  const { data, isLoading, isSuccess } = getById(id);

  if (isLoading) return (
    <div className="flex justify-center items-center h-40">Loading...</div>
  );

  if (!isSuccess) return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-2">City not found (Tanstack)</h2>
    </Card>
  );

  return (
    <Card className="max-w-xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-6">City Details (Tanstack)</h2>
      <div className="grid grid-cols-1 gap-4 mb-6">
        <div>
          <span className="font-semibold">Name (English): </span>
          <span>{data.payload.nameEn}</span>
        </div>
        <div>
          <span className="font-semibold">Name (Bangla): </span>
          <span>{data.payload.nameBn}</span>
        </div>
        <div>
          <span className="font-semibold">Name (Arabic): </span>
          <span>{data.payload.nameAr}</span>
        </div>
        <div>
          <span className="font-semibold">Name (Hindi): </span>
          <span>{data.payload.nameHi}</span>
        </div>
      </div>
      <div className="flex gap-2">
        <Button asChild variant="secondary">
          <Link to={CITY_TANSTACK_PATHS.edit(data?.payload?.id.toString())}>Edit</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to={CITY_TANSTACK_PATHS.index()}>Back to List</Link>
        </Button>
      </div>
    </Card>
  );
};

export default CityDetails;
