import { useViewModel } from "../../../core/hooks/use-view-model";
import { City } from "../models/city";

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

  return useViewModel<City>("/cities");
}
