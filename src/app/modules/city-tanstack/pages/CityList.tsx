import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { toastError, toastSuccess } from "@/lib/toasterUtils.tsx";
import { useState } from "react";
import { Link } from "react-router-dom";
import { confirmPopup } from "@/components/custom/confirmation-popup.tsx";
import { CITY_TANSTACK_PATHS } from "@/app/modules/city-tanstack/routes/paths.ts";
import { useCities } from "@/app/modules/city-tanstack/viewModels/use-cities.ts";

const CityList = () => {
  const [search, setSearch] = useState("");
  const { getAll, remove, queryClient } = useCities();

  const getAllQuery = getAll({ skipPreloader: true });
  const removeMutation = remove();

  const handleDelete = async (id: string) => {
    confirmPopup({
      title: `Delete`,
      description: `Are you sure you want to delete this city?`,
      cancelText: "Cancel",
      confirmText: `Delete`,
      onConfirm: async () => {
        try {
          const result = await removeMutation.mutateAsync(id);
          if (result?.isSuccess) {
            toastSuccess(result?.message || "Deleted successfully");
            // Optionally update pagination here
          } else {
            toastError(result?.message || "Failed to delete city");
          }
          await getAllQuery.refetch({});
        } catch (err: any) {
          toastError(err?.message || "Failed to delete city");
        }
      },
    });
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Optionally implement search with fetchCities if supported
  };

  const handlePageChange = (page: number) => {
    // Optionally implement pagination with fetchCities if supported
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Cities (Tanstack)</h1>

        <div className="flex gap-2">
          <Button disabled={!getAllQuery.isFetching} onClick={() => {
            queryClient.cancelQueries({ queryKey: ['/cities'] })
          }}>Abort</Button>
          <Button disabled={getAllQuery.isFetching} onClick={() => {
            getAllQuery.refetch()
          }}>Refresh</Button>
          <Button asChild>
            <Link to={CITY_TANSTACK_PATHS.create()}>Create New city</Link>
          </Button>
        </div>
      </div>
      <form onSubmit={handleSearch} className="mb-4 flex gap-2">
        <Input
          placeholder="Search cities..."
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
          {(getAllQuery.isFetching || getAllQuery.isLoading) ? (
            <TableRow>
              <TableCell colSpan={5}>Loading...</TableCell>
            </TableRow>
          ) : !getAllQuery.data?.payload?.content?.length ? (
            <TableRow>
              <TableCell colSpan={5}>No countries found</TableCell>
            </TableRow>
          ) : (
            getAllQuery.data?.payload?.content?.map((city: any) => (
              <TableRow key={city.id}>
                <TableCell>{city.nameEn}</TableCell>
                <TableCell>{city.nameBn}</TableCell>
                <TableCell>{city.nameAr}</TableCell>
                <TableCell>{city.nameHi}</TableCell>
                <TableCell>
                  <div className="flex gap-2 justify-end">
                    <Button size="sm" variant="outline" asChild>
                      <Link to={CITY_TANSTACK_PATHS.details(city.id.toString())}>Details</Link>
                    </Button>
                    <Button size="sm" variant="secondary" asChild>
                      <Link to={CITY_TANSTACK_PATHS.edit(city.id.toString())}>Edit</Link>
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(city.id.toString())}>
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

export default CityList;
