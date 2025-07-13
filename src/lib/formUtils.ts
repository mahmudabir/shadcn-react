import type { FieldErrors } from "react-hook-form";


export function logFormErrors(errors: FieldErrors): void  {
    Object.keys(errors).forEach((key) => {
        console.log(`❌ Error in '${key}':`, errors[key]);
    });
}