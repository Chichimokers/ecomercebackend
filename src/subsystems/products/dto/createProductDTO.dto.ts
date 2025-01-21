import {
    IsNotEmpty,
    IsString,
    MinLength,
    MaxLength,
    IsNumber
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from 'src/common/dto/base.dto';

export class createProductDTO extends BaseDto {
    @ApiProperty({
        example: "Meat",
        description: "Product name",
    })
    @Transform(({ value }) => value.trim())
    @IsString()
    @MinLength(2, { message: 'Name must have at least 2 characters.' })
    @MaxLength(20, { message: 'Name must have max 20 characters.' })
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        example: "123.25",
        description: "A valid price",
    })
    
    @IsNotEmpty()
    @IsNumber({}, { message: 'Please provide a valid price.' })
    price: number;

    @ApiProperty({
        example: "100",
        description: "A valid quantity",
    })
    @IsNotEmpty()
    @IsNumber()
    quantity: number;

    @ApiProperty({
        example: "Short Description",
        description: "Short description to show in cards",
    })
    @IsNotEmpty()
    @IsString()
    short_description: string;

    @ApiProperty({
        example: "Large Description",
        description: "Short description to show in cards",
    })
    @IsNotEmpty()
    @IsString()
    description: string;
}