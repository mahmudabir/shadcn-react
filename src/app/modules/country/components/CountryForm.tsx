"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form
} from "@/components/ui/form"
import { useEffect } from "react"
import { toast } from "sonner"
import { FormFieldItem } from "../../../../components/custom/form-field-item"
import { logFormErrors } from "../../../../lib/formUtils"
import { Country } from "../models/country"

export function CountryForm({ initialData = new Country(), onSubmit, submitLabel = 'Submit' }) {
    const form = useForm<z.infer<typeof Country.schema>>({
        resolver: zodResolver(Country.schema),
        mode: "onChange",
        defaultValues: initialData,
    })

    const formValues = form.watch(); // watch entire form

    useEffect(() => {
        logFormErrors(form.formState.errors);
    }, [formValues, form.formState.errors]); // Run when values or errors change

    function onSubmitInternal(data: z.infer<typeof Country.schema>) {
        toast("You submitted the following values", {
            description: (
                <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4">
                    <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                </pre>
            ),
            closeButton: true,
        })
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full
                 mx-auto p-8 rounded-xl shadow-xl space-y-8"
            >
                <h2 className="text-2xl font-semibold border-b pb-2">
                   🌍 {submitLabel} Country
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormFieldItem
                        type="text"
                        control={form.control}
                        name="nameEn"
                        label="English Name"
                        description="This is the country's English display name."
                        className="w-full"
                    />
                    <FormFieldItem
                        type="text"
                        control={form.control}
                        name="nameBn"
                        label="Bangla Name"
                        description="This is the country's Bangla display name."
                        className="w-full"
                    />
                    <FormFieldItem
                        type="text"
                        control={form.control}
                        name="nameAr"
                        label="Arabic Name"
                        description="This is the country's Arabic display name."
                        className="w-full"
                    />
                    <FormFieldItem
                        type="text"
                        control={form.control}
                        name="nameHi"
                        label="Hindi Name"
                        description="This is the country's Hindi display name."
                        className="w-full"
                    />
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

    )
}

export default CountryForm;