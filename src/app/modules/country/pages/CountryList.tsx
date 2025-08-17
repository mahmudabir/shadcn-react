import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { toastError, toastSuccess } from "@/lib/toasterUtils.tsx";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { COUNTRY_PATHS } from "@/app/modules/country/routes/CountryRoutes.tsx";
import { useCountries } from '@/app/modules/country/viewModels/use-countries.ts';
import { confirmPopup } from "@/components/custom/confirmation-popup.tsx";

const CountryList = () => {
  const [search, setSearch] = useState("");
  const { getAll, cancelRequest, remove, reset, isLoading, items } = useCountries();

  useEffect(() => {
    getAllData();
    return () => {
      abortRequest();
    };
  }, []);

  const getAllData = async () => {
    await getAll({ skipPreloader: false, queryKey: "countries_list" });
  };

  const abortRequest = () => {
    cancelRequest("countries_list");
    reset();
  };

  /* Manual Signal  
    const abortControllerRef = useRef<AbortController | null>(null);
  
    useEffect(() => {
      abortController?.abort(); // abort previous request
      getAllData();
      return () => {
        abortController?.abort(); // cleanup on unmount
      };
    }, []);
  
    const getAllData = () => {
      const controller = new AbortController();
      abortController = controller;
      getAll({ skipPreloader: false, signal: controller.signal });
    };
  
    const abortRequest = () => {
      abortController?.abort();
      reset();
      abortController = new AbortController();
    };
    */

  const handleDelete = async (id: string) => {
    confirmPopup({
      title: `Delete`,
      description: `Are you sure you want to delete this country?`,
      cancelText: "Cancel",
      confirmText: `Delete`,
      onConfirm: async () => {
        try {
          const result = await remove(id);
          if (result?.isSuccess) {
            toastSuccess(result?.message || "Deleted successfully");
            // Optionally update pagination here
          } else {
            toastError(result?.message || "Failed to delete country");
          }
          await getAll();
        } catch (err: any) {
          toastError(err?.message || "Failed to delete country");
        }
      },
    });
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Optionally implement search with fetchCountries if supported
  };

  const handlePageChange = (page: number) => {
    // Optionally implement pagination with fetchCountries if supported
  };

  // return <div>
  //   {isLoading ? "isLoading: Loading..." : "isLoading: Loaded!"}
  // </div>

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Countries</h1>
        <div className="flex gap-2">
          <Button onClick={abortRequest}
            disabled={!isLoading}>
            Abort
          </Button>
          <Button onClick={getAllData}
            disabled={isLoading}>
            Refresh
          </Button>
          <Button asChild>
            <Link to={COUNTRY_PATHS.create()}>Create New Country</Link>
          </Button>
        </div>
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
            <TableCell className="font-semibold text-center">Actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading
            ? (
              <TableRow>
                <TableCell colSpan={5}>Loading...</TableCell>
              </TableRow>
            )
            : !items?.payload?.content?.length ? (
              <TableRow>
                <TableCell colSpan={5}>No countries found</TableCell>
              </TableRow>
            )
              : (
                items?.payload?.content?.map((country: any) => (
                  <TableRow key={country.id}>
                    <TableCell>{country.nameEn}</TableCell>
                    <TableCell>{country.nameBn}</TableCell>
                    <TableCell>{country.nameAr}</TableCell>
                    <TableCell>{country.nameHi}</TableCell>
                    <TableCell>
                      <div className="flex gap-2 justify-end">
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
