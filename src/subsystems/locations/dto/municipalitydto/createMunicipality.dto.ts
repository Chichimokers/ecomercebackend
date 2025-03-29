import { IsNotEmpty, MaxLength, IsString, IsNumber, IsPositive, IsUUID, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from "class-transformer";

export class priceBWDTO {
    @ApiProperty({
        example: 20,
        description: "Price applied for min weight",
        required: true,
    })
    @Transform(({ value }) => Number(value))
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    price: number;

    @ApiProperty({
        example: 40,
        description: "Weight in kilograms",
        required: true,
    })
    @Transform(({ value }) => Number(value))
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    minWeight: number;
}

export class createMunicipalityDTO {
    @ApiProperty({
        example: "Guanacabibe",
        description: "The name of the municipality",
        required: true,
    })
    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    name: string;

    @ApiProperty({
        example: "a6e0c570-be0e-4a7d-93c5-767a7767890b",
        description: "Province identifier for relation",
        required: true,
    })
    @IsNotEmpty()
    @IsUUID()
    province: string;

    @ApiProperty({
        example: 100.0,
        description: "Base price of the municipality",
        required: true,
    })
    @Transform(({ value }) => Number(value))
    @IsNumber()
    @IsPositive()
    basePrice: number;

    @ApiProperty({
        example: 24,
        description: "Min of hours to make delivery",
        required: true,
    })
    @Transform(({ value }) => Number(value))
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    minHours: number;

    @ApiProperty({
        example: 48,
        description: "Max of hours to make delivery",
        required: false,
    })
    @Transform(({ value }) => Number(value))
    @IsOptional()
    @IsNumber()
    @IsPositive()
    maxHours?: number;

    @ApiProperty({
        example: [{
            price: 30,
            minWeight: 10,
        }],
        description: "Price applied for min weight",
        required: true,
    })
    @IsOptional()
    @IsArray()
    weightPrices?: priceBWDTO[];
}