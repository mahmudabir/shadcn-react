import { HttpOptions } from "../../../core/api/axios-request-config";
import { useViewModel } from "../../../core/hooks/use-view-model";
import { Country } from "@/app/modules/country-tanstack/models/country.ts";

// MVVM ViewModel for Country
export function useCountries() {
  return useViewModel<Country>("/countries");
}