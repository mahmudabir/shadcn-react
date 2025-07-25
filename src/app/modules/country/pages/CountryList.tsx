import { COUNTRY_PATHS } from "@/app/modules/country/routes/country-paths.ts";
import { toastError, toastSuccess } from "@/lib/toasterUtils.tsx";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteCountry, getCountries } from "../api/countries.ts";
import type { Country } from "../models/country.ts";
import { Pagination } from "@/app/core/models/pagination";
import { Table, TableHeader, TableRow, TableCell, TableBody } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
// import { Pagination as ShadcnPagination } from "@/components/ui/pagination";

const CountryList = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState(new Pagination());
  const [totalRecord, setTotalRecord] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchData = async (searchValue = search, pageNumber = pagination.pageNumber, pageSize = pagination.pageSize) => {
    setLoading(true);
    try {
      // You may need to update getCountries to accept search, pageNumber, pageSize
      const data = await getCountries(/*{ search: searchValue, pageNumber, pageSize }*/);
      if (data.isSuccess) {
        setCountries(data.payload.content || []);
        setTotalRecord(data.payload.totalRecord || 0);
        setPagination(new Pagination({
          pageNumber: data.payload.pageNumber,
          pageSize: data.payload.pageSize,
          totalRecord: data.payload.totalRecord,
        }));
      } else {
        toastError(data.message || "Failed to fetch countries");
      }
    } catch (err) {
      toastError(err.message || "Failed to fetch countries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this country?")) return;
    try {
      const result = await deleteCountry(id);
      if (result.isSuccess) {
        toastSuccess(result.message || "Deleted successfully");
        // Recalculate pagination after delete
        setPagination((prev) => new Pagination(prev).recalculate(1));
      }
      await fetchData();
    } catch (err) {
      toastError(err.message || "Failed to delete country");
    }
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchData(search, 1, pagination.pageSize);
  };

  const handlePageChange = (page: number) => {
    fetchData(search, page, pagination.pageSize);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Countries</h1>
        <Button asChild>
          <Link to={COUNTRY_PATHS.create()}>Create New Country</Link>
        </Button>
      </div>
      <form onSubmit={handleSearch} className="mb-4 flex gap-2">
        <Input
          placeholder="Search countries..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Button type="submit">Search</Button>
      </form>
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell className="font-semibold">Name (English)</TableCell>
            <TableCell className="font-semibold">Name (Bangla)</TableCell>
            <TableCell className="font-semibold">Name (Arabic)</TableCell>
            <TableCell className="font-semibold">Name (Hindi)</TableCell>
            <TableCell className="font-semibold">Actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={5}>Loading...</TableCell>
            </TableRow>
          ) : !countries?.length ? (
            <TableRow>
              <TableCell colSpan={5}>No countries found</TableCell>
            </TableRow>
          ) : (
            countries.map((country) => (
              <TableRow key={country.id}>
                <TableCell>{country.nameEn}</TableCell>
                <TableCell>{country.nameBn}</TableCell>
                <TableCell>{country.nameAr}</TableCell>
                <TableCell>{country.nameHi}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link to={COUNTRY_PATHS.details(country.id.toString())}>Details</Link>
                    </Button>
                    <Button size="sm" variant="secondary" asChild>
                      <Link to={COUNTRY_PATHS.edit(country.id.toString())}>Edit</Link>
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(country.id.toString())}>
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <div className="mt-4 flex justify-end">
        {/* <ShadcPagination
          currentPage={pagination.pageNumber}
          pageSize={pagination.pageSize}
          total={totalRecord}
          onPageChange={handlePageChange}
        /> */}
      </div>
    </Card>
  );
};

export default CountryList;
