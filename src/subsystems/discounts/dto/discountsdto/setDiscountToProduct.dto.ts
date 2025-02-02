import { IsNumber, IsPositive } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class setDiscountToProductDTO {
    @ApiProperty({
        example: 1,
        description: 'Product ID to establish relationship'
    })
    @IsNumber()
    @IsPositive()
    product: string;

    @ApiProperty({
        example: 29,
        description: 'Percent discount of related product'
    })
    @IsNumber()
    @IsPositive()
    reduction: number;

    @ApiProperty({
        example: 29,
        description: 'Percent discount of related product'
    })
    @IsNumber()
    @IsPositive()
    min: number;

}
