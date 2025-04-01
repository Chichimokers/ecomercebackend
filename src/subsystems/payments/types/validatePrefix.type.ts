import { PAYMENT_TYPE } from "../enums/prefix.constants";

export interface ValidatePrefix {
    type: PAYMENT_TYPE;
    id: string;
}