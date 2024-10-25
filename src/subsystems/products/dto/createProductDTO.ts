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
import { ProductClass } from '../enums/products.class.enum';


export class createProductDTO extends BaseDto {
    @ApiProperty({
        example: "tomate",
        description: "product name",
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
        example: "1",
        description: "A valid class",
    })
    @IsNotEmpty()
    @IsNumber({}, { message: 'Please provide a valid class.' })
    class: ProductClass;

    @ApiProperty({
        example: "123",
        description: "A valid quantity",
    })
    @IsNotEmpty()
    @IsNumber()
    quantity: number;
}
