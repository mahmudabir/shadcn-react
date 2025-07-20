import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import z from "zod"
import { FormFieldItem, FormFieldItems } from "../../../../components/custom/form-field-item"
import { Switch } from "../../../../components/ui/switch"
import { logFormErrors } from "../../../../lib/formUtils"
import { FormFieldItemConfig } from "../../../core/models/form-field-item-config"
import { City } from "../models/city"
import { Country } from "../models/country"


// Main CountryForm component
const CountryForm = ({ initialData = new Country(), onSubmit, submitLabel = 'Submit' }) => {

    const [renderFormFieldsUsingFormFieldItemConfig, setRenderFormFieldsUsingFormFieldItemConfig] = useState(true);

    // Define the type for form data using Zod schema
    // This ensures that the form data adheres to the structure defined in the Country schema
    type CountryData = z.infer<typeof Country.schema>;

    // Initialize form with Zod schema validation
    const form = useForm<CountryData>({
        resolver: zodResolver(Country.schema),
        mode: "onChange",
        defaultValues: initialData,
    });

    const formValues = form.watch(); // watch entire form

    // For dynamic cities
    const { fields: cityFields, append: appendCity, remove: removeCity } = useFieldArray({
        control: form.control,
        name: "cities",
    });

    useEffect(() => {
        logFormErrors(form.formState.errors);
        console.log(formValues);
    }, [formValues, form.formState.errors]); // Run when values or errors change

    const countryFieldsConfig: FormFieldItemConfig<Country>[] = [
        {
            type: "text",
            control: form.control,
            name: "nameEn",
            label: "English Name",
            description: "Country's English display name",
            className: "w-full",
        },
        {
            type: "text",
            control: form.control,
            name: "nameBn",
            label: "Bangla Name",
            description: "Country's Bangla display name",
            className: "w-full",
        },
        {
            type: "text",
            control: form.control,
            name: "nameAr",
            label: "Arabic Name",
            description: "Country's Arabic display name",
            className: "w-full",
        },
        {
            type: "text",
            control: form.control,
            name: "nameHi",
            label: "Hindi Name",
            description: "Country's Hindi display name",
            className: "w-full",
        },
    ];

    const cityFieldsConfig: FormFieldItemConfig<City>[] = [
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
        },
    ];

    return (
        <Form {...form}>
            <form className="w-full mx-auto p-8 rounded-xl shadow-xl space-y-8"
                onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex justify-between mb-4 border-b">
                    <h2 className="text-2xl font-semibold pb-2">
                        🌍 {submitLabel} Country
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
                        ? <FormFieldItems items={countryFieldsConfig} />
                        : (
                            <>
                                <FormFieldItem
                                    type="text"
                                    control={form.control}
                                    name="nameEn"
                                    label="English Name"
                                    description="This is the country's English display name"
                                />
                                <FormFieldItem
                                    type="text"
                                    control={form.control}
                                    name="nameBn"
                                    label="Bangla Name"
                                    description="This is the country's Bangla display name"
                                />
                                <FormFieldItem
                                    type="text"
                                    control={form.control}
                                    name="nameAr"
                                    label="Arabic Name"
                                    description="This is the country's Arabic display name"
                                />
                                <FormFieldItem
                                    type="text"
                                    control={form.control}
                                    name="nameHi"
                                    label="Hindi Name"
                                    description="This is the country's Hindi display name"
                                />
                            </>)
                    }
                </div>

                {/* Cities Section */}
                <div className="pt-8">
                    <h3 className="text-xl font-semibold mb-4">🏙️ Cities</h3>
                    <div className="space-y-6">
                        {cityFields.map((field, idx) => (
                            <div key={field.id} className="border rounded-lg p-4 bg-neutral-50 dark:bg-neutral-900">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="font-semibold text-lg">City #{idx + 1}</h4>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="hover:bg-red-100 dark:hover:bg-red-900 text-red-600"
                                        onClick={() => removeCity(idx)}
                                        title="Remove city"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </Button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">


                                    {renderFormFieldsUsingFormFieldItemConfig
                                        ? <FormFieldItems items={cityFieldsConfig.map(config => ({
                                            ...config,
                                            name: `cities.${idx}.${config.name}`
                                        }))} />
                                        : (
                                            <>
                                                <FormFieldItem
                                                    type="text"
                                                    control={form.control}
                                                    name={`cities.${idx}.nameEn`}
                                                    label="English Name"
                                                    description="This is the city's English display name"
                                                />
                                                <FormFieldItem
                                                    type="text"
                                                    control={form.control}
                                                    name={`cities.${idx}.nameBn`}
                                                    label="Bangla Name"
                                                    description="This is the city's Bangla display name"
                                                />
                                                <FormFieldItem
                                                    type="text"
                                                    control={form.control}
                                                    name={`cities.${idx}.nameAr`}
                                                    label="Arabic Name"
                                                    description="This is the city's Arabic display name"
                                                />
                                                <FormFieldItem
                                                    type="text"
                                                    control={form.control}
                                                    name={`cities.${idx}.nameHi`}
                                                    label="Hindi Name"
                                                    description="This is the city's Hindi display name"
                                                />
                                            </>)
                                    }
                                </div>
                            </div>
                        ))}
                        <div className="flex justify-end items-center mb-4">
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full md:w-1/3"
                                onClick={() => appendCity({ nameEn: '', nameBn: '', nameAr: '', nameHi: '', countryId: 0 })}
                            >
                                + Add City
                            </Button>
                        </div>
                    </div>
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

export default CountryForm;