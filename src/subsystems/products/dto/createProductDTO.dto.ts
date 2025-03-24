import {
    IsNotEmpty,
    IsString,
    MinLength,
    MaxLength,
    IsNumber, IsOptional, IsUUID, IsPositive, IsInt
} from "class-validator";
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { BaseDto } from 'src/common/dto/base.dto';

export class CreateProductDTO extends BaseDto {
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
    @Transform(({ value }) => Number(value))
    @IsNotEmpty()
    @IsNumber({}, { message: 'Please provide a valid price.' })
    price: number;

    @ApiProperty({
        example: "100",
        description: "A valid quantity",
    })
    @Transform(({ value }) => Number(value))
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

    @ApiProperty({
        example: 40,
        description: "Min of products to apply discount",
        required: false,
    })
    @Transform(({ value }) => Number(value))
    @IsInt()
    @IsOptional()
    min?: number;

    @ApiProperty({
        example: 39.5,
        description: "Reduction of price of the product",
        required: false,
    })
    @Transform(({ value }) => Number(value))
    @IsNumber()
    @IsOptional()
    reduction?: number;

    @ApiProperty({
        example: "a6e0c570-be0e-4a7d-93c5-767a7767890b",
        description: "ID Category to change",
        required: false,
    })
    @Transform(({ value }) => Number(value))
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
        example: 30.0,
        description: "Weight of the product"
    })
    @Transform(({ value }) => Number(value))
    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    weight: number;

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
        description: "ID of province",
    })
    @IsNotEmpty()
    @IsUUID()
    province: string;
}