import { Control } from "react-hook-form";

export type FormFieldItemConfig<T> = {
    type: "checkbox" | "switch" | "radio" | "textarea" | "number" | "email" | "password" | "date" | "time" | "url" | "tel" | "color" | "range" | "text",
    control: Control<any>,
    name: string,
    label: string,
    description: string,
    className: "w-full" | "w-1/2" | "w-1/3" | "w-1/4" | "w-1/5" | "w-1/6" | "w-1/12" | "w-full md:w-1/2 lg:w-1/3 xl:w-1/4 2xl:w-1/5",
};