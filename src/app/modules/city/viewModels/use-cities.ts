import { useViewModel } from "@/app/core/hooks/use-view-model.ts";
import { City } from "@/app/modules/city-tanstack/models/city.ts";
import { HttpOptions } from "@/app/core/api/api-request-config.ts";

// MVVM ViewModel for Country
export function useCities() {
  // Return the hook itself for consumers to use
  // const viewModel = useViewModel<Country>("/countries");
  // const [customState, setCustomState] = useState("This is a custom state");

  // return {
  //   ...viewModel,
  //   customState,
  //   setCustomState,
  // };

  return useViewModel<City, HttpOptions>("/cities");
}