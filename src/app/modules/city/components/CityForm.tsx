import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import z from "zod"
import { confirmPopup } from "../../../../components/custom/confirmation-popup"
import { FormFieldItem, FormFieldItems, SelectFieldItem } from "../../../../components/custom/form-field-item"
import { Switch } from "../../../../components/ui/switch"
import { logFormErrors } from "../../../../lib/formUtils"
import { FormFieldItemConfig } from "../../../core/models/form-field-item-config"
import { SelectOption } from "../../../core/models/select-option"
import { useCountries } from "../../country/viewModels/use-countries"
import { City } from "../models/city"


// Main CountryForm component

const CityForm = ({ initialData = new City(), onSubmit, submitLabel = 'Submit' }) => {
    const [renderFormFieldsUsingFormFieldItemConfig, setRenderFormFieldsUsingFormFieldItemConfig] = useState(true);
    const countryViewModel = useCountries();

    // Define the type for form data using Zod schema
    // This ensures that the form data adheres to the structure defined in the Country schema
    type CityData = z.infer<typeof City.schema>;

    // Initialize form with Zod schema validation
    const form = useForm({
        resolver: zodResolver(City.schema),
        mode: "onBlur",
        defaultValues: { ...initialData },
    });

    const formValues = form.watch(); // watch entire form

    useEffect(() => {
        logFormErrors(form.formState.errors);
        console.log(formValues);
    }, [formValues, form.formState.errors]); // Run when values or errors change

    const [countryOptions, setCountryOptions] = useState<SelectOption[]>([]);

    useEffect(() => {
        countryViewModel.getSelectItems("nameEn", "id", "Select a country").then(() => {
            setCountryOptions(countryViewModel.selectItems);
        });
    }, []);

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
            className: "w-full"
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

    console.log(countryOptions);


    return (
        <Form {...form}>
            <form className="w-full mx-auto p-8 rounded-xl shadow-xl space-y-8"
                onSubmit={form.handleSubmit(() => confirmPopup(confirmationOptions))}>
                <div className="flex justify-between mb-4 border-b">
                    <h2 className="text-2xl font-semibold pb-2">
                        🌍 {submitLabel} City
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
                        ? <FormFieldItems items={cityFieldsConfig} options={countryViewModel.selectItems} />
                        : (
                            <>
                                <SelectFieldItem
                                    control={form.control}
                                    name="countryId"
                                    label="Country"
                                    description="Select the country for this city"
                                    placeholder="Select a country"
                                    options={countryViewModel.selectItems}
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