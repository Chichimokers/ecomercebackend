import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';
import { BaseDto } from 'src/common/dto/base.dto';

export class CartDTO extends BaseDto {
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