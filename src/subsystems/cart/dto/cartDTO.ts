
import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';

export class CartDto {
    @IsNumber()
    @IsNotEmpty()
    total: number;

    @IsNumber()
    @IsNotEmpty()
    quantity: number;

    @IsNotEmpty()
    orderId: number; // ID de la orden

    @IsNotEmpty()
    productId: number; // ID del producto

    @IsNotEmpty()
    userId: number; // ID del usuario

    @IsBoolean()
    paid: boolean;
}