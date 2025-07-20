import { FormFieldItemConfig } from "../../app/core/models/form-field-item-config";
import { Checkbox } from "../ui/checkbox";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";


export function FormFieldItems(props: { items: FormFieldItemConfig<any>[] }) {
    return (
        <>
            {props.items.map((item, index) => (
                <FormFieldItem key={index} {...item} />
            ))}
        </>
    );
}

export function FormFieldItem(props: { type?: string; control: any; name: string; label: string; description: string; className?: string }) {

    const { type, control, name, label, description, className = "w-full" } = props;

    const fieldType = type || "text"; // Default to text if no type is provided
    const fieldElement = (field) => {
        switch (fieldType) {
            case "checkbox":
                return <Checkbox checked={!!field.value} onCheckedChange={val => field.onChange(val)} />;
            case "switch":
                return <Switch checked={!!field.value} onCheckedChange={val => field.onChange(val)} />;
            case "radio":
                return <input type="radio" {...field} checked={!!field.checked} onCheckedChange={val => field.onChange(val)} />;
            // case "select":
            //     // You may want to pass options as a prop for select
            //     return <select {...field}>{/* options go here */}</select>;
            case "textarea":
                return <textarea {...field} />;
            case "number":
            case "email":
            case "password":
            case "date":
            case "time":
            case "url":
            case "tel":
            case "color":
            case "range":
            case "text":
            default:
                return <Input {...field} type={fieldType} />;
        }
    }

    return (
        <div className={className}>
            <FormField
                control={control}
                name={name}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            <strong>{label}</strong>
                            <FormDescription>
                                {description}
                            </FormDescription></FormLabel>
                        <FormControl>
                            {fieldElement(field)}
                        </FormControl>

                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}