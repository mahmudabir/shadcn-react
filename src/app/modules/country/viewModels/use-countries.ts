import { useViewModel } from "../../../core/hooks/use-view-model";
import { Country } from "../models/country";

// MVVM ViewModel for Country
export function useCountries() {
  return useViewModel<Country>("/countries");
}