import { useViewModel } from "../../../core/hooks/use-view-model";
import { Country } from "../models/country";

// MVVM ViewModel for Country
export function useCountries() {
  // Return the hook itself for consumers to use
  // const viewModel = useViewModel<Country>("/countries");
  // const [customState, setCustomState] = useState("This is a custom state");

  // return {
  //   ...viewModel,
  //   customState,
  //   setCustomState,
  // };

  return useViewModel<Country>("/countries");
}
