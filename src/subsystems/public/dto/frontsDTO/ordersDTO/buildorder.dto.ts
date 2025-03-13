import { ApiProperty } from "@nestjs/swagger";
import {
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsPositive,
    IsString,
    IsUUID,
    Length,
    ValidateNested
} from "class-validator";
import { Type } from "class-transformer";
import { IsValidCI } from "../../../../orders/decorators/orders.decorator";


/**
 * DTO To take and validate data sent from the frontend to create an order
 */
export class ProductOrderDTO {
    @ApiProperty({
        description: 'ID of the product',
        example: 1
    })
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    product_id: string;

    @ApiProperty({
        description: 'Quantity of the product',
        example: 2
    })
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    quantity: number;
}


export class BuildOrderDTO {
    @ApiProperty({
        description: 'List of products to be ordered',
        type: [ProductOrderDTO],
        example: [
            { product_id: 1, quantity: 2 },
            { product_id: 2, quantity: 1 }
        ]
    })
    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => ProductOrderDTO)
    products: ProductOrderDTO[];

    @ApiProperty({
        description: 'Province of the receiver',
        example: 'Havana'
    })
    @IsNotEmpty()
    @IsString()
    @Length(1, 20)
    province: string;

    @ApiProperty({
        description: 'Address of the receiver',
        example: '123 Main St, Apt 4B'
    })
    @IsNotEmpty()
    @IsString()
    @Length(1, 255)
    address: string;

    @ApiProperty({
        description: 'Name of the receiver',
        example: 'John Doe'
    })
    @IsNotEmpty()
    @IsString()
    @Length(1, 70)
    receiver_name: string;

    @ApiProperty({
        description: 'CI of the receiver',
        example: '12345678901'
    })
    @IsNotEmpty()
    @IsString()
    @IsValidCI()
    @Length(11, 20)
    ci: string;

    @ApiProperty({
        description: 'Phone number of the receiver',
        example: '+53 --------'
    })
    @IsNotEmpty()
    @IsString()
    @Length(1, 20)
    phone: string;

    @ApiProperty({
        description: 'Auxiliary number of the receiver',
        example: '+53 --------'
    })
    @IsOptional()
    @IsString()
    @Length(1, 20)
    aux_phone?: string;

    @ApiProperty({
        example: 'a6e0c570-be0e-4a7d-93c5-767a7767890b',
        description: 'The id of the province',
    })
    @IsNotEmpty()
    @IsUUID()
    municipality: string;
}
