import { IsDate, IsNumber, IsString, Max, Min } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';
import { IsFutureDate } from "../../decorators/offer.decorator";

export class setOfferToProductDTO {
    @ApiProperty({
        example: 1,
        description: 'Product ID to establish relationship'
    })
    @IsNumber()
    product: number;

    @ApiProperty({
        example: 29,
        description: 'Percent discount of related product'
    })
    @IsNumber()
    @Min(0)
    @Max(100)
    percentage: number;

    @ApiProperty({
        example: 'Black friday offer',
        description: 'A little description about the offer',
    })
    @IsString()
    description: string;

    @ApiProperty({
        example: 'Date example',
        description: 'Date of the day the offer will expire'
    })
    @IsDate()
    @IsFutureDate({message: 'Expire date must be in the future'})
    expire_at: Date;
}
