import {
    IsNotEmpty,
    IsString,
    MinLength,
    MaxLength,
    IsNumber, IsUUID, IsInt, IsOptional,
} from 'class-validator';

import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from 'src/common/dto/base.dto';

export class UpdateProductDTO extends BaseDto{
    
    @ApiProperty({
        example: 39,
        description: "peso del producto ",
    })
    @Transform(({ value }) => Number(value))
    @IsNumber()
    @MinLength(2, { message: 'Name must have at least 2 characters.' })
    @MaxLength(20, { message: 'Name must have max 20 characters.' })
    @IsNotEmpty()
    weight?: number;

    @ApiProperty({
        example: "Meat",
        description: "Product Name",
        required: false,
    })
    @Transform(({ value }) => value.trim())
    @IsOptional()
    @IsString()
    @MinLength(2, { message: 'Name must have at least 2 characters.' })
    @MaxLength(20, { message: 'Name must have max 20 characters.' })
    @IsNotEmpty()
    name?: string;

    @ApiProperty({
        example: "123.25",
        description: "A valid price",
        required: false,
    })
    @Transform(({ value }) => Number(value))
    @IsOptional()
    @IsNotEmpty()
    @IsNumber({}, { message: 'Please provide valid price.' })
    price?: number;

    @ApiProperty({
        example: "120",
        description: "A valid quantity",
        required: false,
    })
    @Transform(({ value }) => Number(value))
    @IsOptional()
    @IsNotEmpty()
    quantity?: number;

    @ApiProperty({
        example: "Short Description",
        description: "Short description to show in cards",
        required: false,
    })
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    short_description?: string;

    @ApiProperty({
        example: "Large Description",
        description: "Short description to show in cards",
        required: false,
    })
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    description?: string;

    @ApiProperty({
        example: "a6e0c570-be0e-4a7d-93c5-767a7767890b",
        description: "ID Category to change",
        required: false,
    })
    @IsOptional()
    @IsNotEmpty()
    @IsUUID()
    category?: string;

    @ApiProperty({
        example: "a6e0c570-be0e-4a7d-93c5-767a7767890b",
        description: "ID subCategory to change",
        required: false,
    })
    @IsOptional()
    @IsNotEmpty()
    @IsUUID()
    subCategory?: string;

    @ApiProperty({
        example: 40,
        description: "Min of products to apply discount",
    })
    @Transform(({ value }) => Number(value))
    @IsInt()
    @IsOptional()
    min?: number;

    @ApiProperty({
        example: 39.5,
        description: "Reduction of price of the product",
    })
    @Transform(({ value }) => Number(value))
    @IsNumber()
    @IsOptional()
    reduction?: number;

    @ApiProperty({
        example: "Don't include in body please",
        description: "Image Path for images",
        required: false,
    })
    @IsOptional()
    @IsNotEmpty()
    image?: string;

    @ApiProperty({
        example: "a6e0c570-be0e-4a7d-93c5-767a7767890b",
        description: "ID Province to change",
        required: false,
    })
    @IsOptional()
    @IsUUID()
    province?: string;
}