import { Result } from "@/app/core/models/result.ts";
import type { FieldErrors } from "react-hook-form";
import { toastInfo } from "./toasterUtils";

export function logFormErrors(errors: FieldErrors, path: string = ""): void {

    // console.log(errors);


    Object.entries(errors).forEach(([key, value]) => {
        const fullPath = path ? `${path}.${key}` : key;

        if (!value) return;

        if (value?.message) {
            console.log(`❌ Error in '${fullPath}':`, { message: value?.message, type: value?.type });
        }

        if (typeof value === "object" && value) {
            if (Array.isArray(value)) { // If it's an array of nested errors
                value.forEach((item, index) => {
                    logFormErrors(item, `${fullPath}[${index}]`);
                });
            } else if (typeof value === "object" && !value?.message) { // If it's a nested object
                logFormErrors(value as FieldErrors, fullPath);
            }
        }
    });
}

// export function logFormErrors(errors: FieldErrors): void {
//     console.log("Form errors: ");
//     Object.keys(errors).forEach((key) => {
//         console.log(`❌ Error in '${key}':`, errors[key]);
//     });
// }

export function logFormValues(formValues?: any): void {
    console.log("Form values: ", formValues);
}

export function getErrorMessages(result: Result<any>) {
    return Object.entries(result.errors)
        .map(([property, messages], index) => `• ${messages.join(' • ')}`)
        .join(' \n• ');
}

export function onSubmitTest(data) {
    console.log("Form submitted with data:", data);
    toastInfo((
        <pre>
            <code className="">{JSON.stringify(data, null, 2)}</code>
        </pre>),
        "You submitted the following values"
    );
}