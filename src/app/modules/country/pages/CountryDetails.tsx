import { COUNTRY_PATHS } from "@/app/modules/country/routes/country-paths.ts";
import { toastError } from "@/lib/toasterUtils.tsx";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getCountryById } from "../api/countries.ts";
import type { Country } from "../models/country.ts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const CountryDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [country, setCountry] = useState<Country | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async (id: string) => {
    setLoading(true);
    try {
      const data = await getCountryById(id);
      if (data.isSuccess) {
        setCountry(data.payload);
      } else {
        toastError(data.message || "Failed to fetch country");
      }
    } catch (err) {
      toastError(err.message || "Failed to fetch country");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchData(id);
    // eslint-disable-next-line
  }, [id]);

  if (loading) return <div className="flex justify-center items-center h-40">Loading...</div>;
  if (!country) return <Card className="p-6"><h2 className="text-xl font-bold mb-2">Country not found</h2></Card>;

  return (
    <Card className="max-w-xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-6">Country Details</h2>
      <div className="grid grid-cols-1 gap-4 mb-6">
        <div>
          <span className="font-semibold">Name (English): </span>
          <span>{country.nameEn}</span>
        </div>
        <div>
          <span className="font-semibold">Name (Bangla): </span>
          <span>{country.nameBn}</span>
        </div>
        <div>
          <span className="font-semibold">Name (Arabic): </span>
          <span>{country.nameAr}</span>
        </div>
        <div>
          <span className="font-semibold">Name (Hindi): </span>
          <span>{country.nameHi}</span>
        </div>
      </div>
      <div className="flex gap-2">
        <Button asChild variant="secondary">
          <Link to={COUNTRY_PATHS.edit(country.id.toString())}>Edit</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to={COUNTRY_PATHS.index()}>Back to List</Link>
        </Button>
      </div>
    </Card>
  );
};

export default CountryDetails;
