import type { FieldErrors } from "react-hook-form";
import { Result } from "@/app/core/models/result.ts";


export function logFormErrors(errors: FieldErrors): void  {
    Object.keys(errors).forEach((key) => {
        console.log(`❌ Error in '${key}':`, errors[key]);
    });
}

export function getErrorMessages(result: Result<any>) {
    return Object.entries(result.errors)
        .map(([property, messages], index) => `• ${messages.join(' • ')}`)
        .join(' \n• ');
}