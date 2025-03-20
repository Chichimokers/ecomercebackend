import { PAYMENT_TYPE } from "../enums/prefix.constants";

export function validateAndQuitPrefix(id: string) {
    console.log(id);
    const paymentTypes: PAYMENT_TYPE[] = Object.values(PAYMENT_TYPE);

    for (const paymentType of paymentTypes) {
        console.log(paymentType);
        const prefix: string = paymentType + "_";

        if (id.startsWith(paymentType)) {
            console.log('Se encontro el prefix!')
            return {
                type: paymentType,
                id: id.replace(prefix, "")
            };
        }
    }
    
    return null;
}