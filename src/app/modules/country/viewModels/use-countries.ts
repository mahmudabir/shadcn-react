import { useViewModel } from "@/app/core/hooks/use-view-model.ts";
import { Country } from "@/app/modules/country-tanstack/models/country.ts";

// MVVM ViewModel for Country
export function useCountries() {
  return useViewModel<Country>("/countries");
}