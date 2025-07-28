import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { FormFieldItemConfig } from "../../app/core/models/form-field-item-config";
import { SelectOption } from "../../app/core/models/select-option";


export function FormFieldItems(props: { items: FormFieldItemConfig<any>[], options?: SelectOption[] }) {

    const options = props.options ?? [];

    return (
        <>
            {props.items.map((item, index) => (//<FormFieldItem key={index} {...item} />
                item.type != "select"
                    ? <FormFieldItem key={index} {...item} />
                    : <SelectFieldItem key={index} {...item} options={options} />
            ))}
        </>
    );
}

export function FormFieldItem(props: { type?: string; control: any; name: string; label: string; description: string; placeholder?: string; className?: string, options?: SelectOption[] }) {

    const { type, control, name, label, description, placeholder, options, className = "w-full" } = props;

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
                return <Input {...field} value={field.value ?? ""} type={fieldType} />;
        }
    }

    if (fieldType == "select") {
        return (
            <SelectFieldItem {...props} />
        )
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
                            </FormDescription>
                        </FormLabel>
                        <FormControl>
                            {fieldElement(field)}
                        </FormControl>

                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    )
}

export function SelectFieldItem(props: { control: any; name: string; label: string; description: string; placeholder?: string; className?: string, options?: SelectOption[] }) {
    const { control, name, label, description, placeholder, options, className = "w-full" } = props;

    return (
        <div className={className}>
            <FormField
                control={control}
                name={name}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>{label}</FormLabel>
                        <Select
                            value={field.value === undefined || field.value === null ? "" : String(field.value)}
                            onValueChange={val => field.onChange(val)}
                        >
                            <FormControl>
                                {/* Force SelectTrigger to full width */}
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder={placeholder} />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {options && options?.map((item, index) => (
                                    <SelectItem key={index} value={String(item.value)}>{item.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormDescription>
                            {description}
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}