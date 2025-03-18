import { IsNumber, IsPositive, IsUUID } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class setDiscountToProductDTO {
    @ApiProperty({
        example: 'uuid4',
        description: 'Product ID to establish relationship'
    })
    @IsUUID()
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
