import {
    IsAlphanumeric,
    IsEmail,
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsString,
    Matches,
    MinLength,
    MaxLength,
    IsArray,
    ArrayNotEmpty,
    IsOptional,
    IsNumber
} from 'class-validator';

import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseDto } from 'src/common/dto/base.dto';


const passwordRegEx =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{8,20}$/;

export class  updateProductDTO {

    @ApiProperty({
        example: "tomate",
        description: "nombre del producto",
    })

    @Transform(({ value }) => value.trim())
    @IsString()
    @MinLength(2, { message: 'Name must have atleast 2 characters.' })
    @MaxLength(20, { message: 'Name must have max 20 characters.' })
    @IsNotEmpty()
    name?: string;


    @ApiProperty({
        example: "123.25",
        description: "A valid price",
    })
    @IsNumber({}, { message: 'Please provide valid price.' })
    price?: number;



    @ApiProperty({
        example: "123",
        description: "A valid quantity",
    })
    @IsNotEmpty()
    quantity?: number;

}