import type { FieldErrors } from "react-hook-form";
import { Result } from "@/app/core/models/result.ts";
import { toastInfo } from "./toasterUtils";


export function logFormErrors(errors: FieldErrors): void {
    console.log("Form errors: ");
    Object.keys(errors).forEach((key) => {
        console.log(`❌ Error in '${key}':`, errors[key]);
    });
}

export function getErrorMessages(result: Result<any>) {
    return Object.entries(result.errors)
        .map(([property, messages], index) => `• ${messages.join(' • ')}`)
        .join(' \n• ');
}

export function onSubmitTest(data) {
    toastInfo((
        <pre>
            <code className="">{JSON.stringify(data, null, 2)}</code>
        </pre>),
        "You submitted the following values"
    );
}