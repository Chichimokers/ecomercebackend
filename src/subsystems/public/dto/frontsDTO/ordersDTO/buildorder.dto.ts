import { IsNotEmpty, IsNumber, IsPositive, IsString, Length, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

/**
 * DTO To take and validate data sent from the frontend to create an order
 */
export class BuildOrderDTO {
    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => ProductOrderDTO)
    products: ProductOrderDTO[];

    @IsNotEmpty()
    @IsString()
    @Length(1, 20)
    province: string;

    @IsNotEmpty()
    @IsString()
    @Length(1, 255)
    address: string;

    @IsNotEmpty()
    @IsString()
    @Length(1, 70)
    receiver_name: string;

    @IsNotEmpty()
    @IsString()
    @Length(11, 20)
    ci: string;


    @IsNotEmpty()
    @IsString()
    @Length(1, 15)
    phone: string;
}

class ProductOrderDTO {

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    product_id: number;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    quantity: number;
}