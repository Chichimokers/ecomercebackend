import { IsNotEmpty, IsNumber, IsPositive, IsUUID } from "class-validator";

export class ShippingDTO {
    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    total_weight: number;

    @IsUUID()
    @IsNotEmpty()
    municipality: string;
}