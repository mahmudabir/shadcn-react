import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { confirmPopup } from "@/components/custom/confirmation-popup.tsx"
import { FormFieldItem, FormFieldItems, SelectFieldItem } from "@/components/custom/form-field-item.tsx"
import { Switch } from "@/components/ui/switch.tsx"
import { logFormState } from "@/lib/formUtils.tsx"
import { FormFieldItemConfig } from "@/app/core/models/form-field-item-config.ts"
import { City } from "@/app/modules/city-tanstack/models/city.ts"
import { CityFormProps } from "@/app/modules/city-tanstack/components/CityForm.tsx"
import { useDebounce } from "@/hooks/use-debounce.ts";


// Main CountryForm component
const CityForm = (props: CityFormProps) => {
  const { initialData, countryOptions, submitLabel, onSubmit } = props;
  const [renderFormFieldsUsingFormFieldItemConfig, setRenderFormFieldsUsingFormFieldItemConfig] = useState(true);

  // Initialize form with Zod schema validation
  const form = useForm({
    resolver: zodResolver(City.schema),
    mode: "onBlur",
    defaultValues: { ...initialData },
  });

  useEffect(() => {
    form.reset({ ...initialData });
  }, [initialData, countryOptions]);

  const formValues = form.watch(); // watch entire form

  useDebounce(() => {
    logFormState(formValues, form.formState.errors, "City Form State");
    return () => {
      console.clear();
    }
  }, [formValues, form.formState.errors], 0); // Run when values or errors change

  const confirmationOptions = {
    title: `${submitLabel}?`,
    description: `Are you sure you want to ${submitLabel.toLowerCase()} this city?`,
    cancelText: "Cancel",
    confirmText: submitLabel,
    onCancel() {
      form.reset({ ...initialData }, { keepValues: false }); // Reset form to initial data
      console.log(formValues);
    },
    onConfirm() {
      onSubmit(formValues);
    },
  };

  const cityFieldsConfig: FormFieldItemConfig<City>[] = [
    {
      type: "select",
      control: form.control,
      name: "countryId",
      label: "Country",
      description: "Select the country for this city",
      placeholder: "Select a country",
      className: "w-full",
      options: countryOptions
    },
    {
      type: "text",
      control: form.control,
      name: "nameEn",
      label: "English Name",
      description: "City's English display name",
      className: "w-full",
    },
    {
      type: "text",
      control: form.control,
      name: "nameBn",
      label: "Bangla Name",
      description: "City's Bangla display name",
      className: "w-full",
    },
    {
      type: "text",
      control: form.control,
      name: "nameAr",
      label: "Arabic Name",
      description: "City's Arabic display name",
      className: "w-full",
    },
    {
      type: "text",
      control: form.control,
      name: "nameHi",
      label: "Hindi Name",
      description: "City's Hindi display name",
      className: "w-full",
    }
  ];


  return (
    <Form {...form}>
      <form className="w-full mx-auto p-8 rounded-xl shadow-xl space-y-8"
            onSubmit={form.handleSubmit(() => confirmPopup(confirmationOptions))}>
        <div className="flex justify-between mb-4 border-b">
          <h2 className="text-2xl font-semibold pb-2">
            🏙️ {submitLabel} City
          </h2>
          <Switch
            className="mb-4"
            checked={renderFormFieldsUsingFormFieldItemConfig}
            onCheckedChange={setRenderFormFieldsUsingFormFieldItemConfig}
          >
            Render Form Fields
          </Switch>
        </div>

        {/* Countries Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {renderFormFieldsUsingFormFieldItemConfig
            ? <FormFieldItems items={cityFieldsConfig}/>
            : (
              <>
                <SelectFieldItem
                  control={form.control}
                  name="countryId"
                  label="Country"
                  description="Select the country for this city"
                  placeholder="Select a country"
                  options={countryOptions}
                />
                <FormFieldItem
                  type="text"
                  control={form.control}
                  name="nameEn"
                  label="English Name"
                  description="This is the city's English display name"
                />
                <FormFieldItem
                  type="text"
                  control={form.control}
                  name="nameBn"
                  label="Bangla Name"
                  description="This is the city's Bangla display name"
                />
                <FormFieldItem
                  type="text"
                  control={form.control}
                  name="nameAr"
                  label="Arabic Name"
                  description="This is the city's Arabic display name"
                />
                <FormFieldItem
                  type="text"
                  control={form.control}
                  name="nameHi"
                  label="Hindi Name"
                  description="This is the city's Hindi display name"
                />
              </>)
          }
        </div>

        <div className="flex justify-center pt-4">
          <Button
            type="submit"
            className="w-full md:w-1/2 font-semibold py-3 rounded-lg shadow-md"
          >
            {submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CityForm;