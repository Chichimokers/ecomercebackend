import { PAYMENT_TYPE } from "../enums/prefix.constants";
import { ValidatePrefix } from "../types/validatePrefix.type";

export function validateAndQuitPrefix(id: string): ValidatePrefix | null {
    const paymentTypes: PAYMENT_TYPE[] = Object.values(PAYMENT_TYPE);

    for (const paymentType of paymentTypes) {
        const prefix: string = paymentType + "_";

        if (id.startsWith(paymentType)) {
            return {
                type: paymentType,
                id: id.replace(prefix, "")
            };
        }
    }
    
    return null;
}