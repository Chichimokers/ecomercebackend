// src/subsystems/orders/dto/order.dto.ts
import { IsNumber, IsString } from 'class-validator';
import { BaseDto } from 'src/common/dto/base.dto';

export class OrderDTO extends BaseDto {
    @IsString()
    phone: string;

    @IsString()
    address: string;

    @IsNumber()
    CI: number;

    @IsNumber()
    subTotal: number;

    @IsNumber()
    pending: boolean;
}