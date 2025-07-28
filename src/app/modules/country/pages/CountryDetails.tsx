import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useCountries } from '../viewModels/use-countries';
import { COUNTRY_PATHS } from "../routes/CountryRoutes";

const CountryDetails = () => {
  const params = useParams<{ id: string }>();
  const countryViewModel = useCountries();

  useEffect(() => {
    if (!params.id) return;
    countryViewModel.getById(params.id);
    // eslint-disable-next-line
  }, [params.id]);

  if (countryViewModel.isLoading) return <div className="flex justify-center items-center h-40">Loading...</div>;
  if (!countryViewModel.item.isSuccess) return <Card className="p-6"><h2 className="text-xl font-bold mb-2">Country not found</h2></Card>;

  return (
    <Card className="max-w-xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-6">Country Details</h2>
      <div className="grid grid-cols-1 gap-4 mb-6">
        <div>
          <span className="font-semibold">Name (English): </span>
          <span>{countryViewModel.item.payload.nameEn}</span>
        </div>
        <div>
          <span className="font-semibold">Name (Bangla): </span>
          <span>{countryViewModel.item.payload.nameBn}</span>
        </div>
        <div>
          <span className="font-semibold">Name (Arabic): </span>
          <span>{countryViewModel.item.payload.nameAr}</span>
        </div>
        <div>
          <span className="font-semibold">Name (Hindi): </span>
          <span>{countryViewModel.item.payload.nameHi}</span>
        </div>
      </div>
      <div className="flex gap-2">
        <Button asChild variant="secondary">
          <Link to={COUNTRY_PATHS.edit(countryViewModel.item?.payload?.id.toString())}>Edit</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to={COUNTRY_PATHS.index()}>Back to List</Link>
        </Button>
      </div>
    </Card>
  );
};

export default CountryDetails;
