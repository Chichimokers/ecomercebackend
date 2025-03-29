import { ApiProperty } from '@nestjs/swagger';
import {
    IsNumber,
    IsOptional,
    IsPositive,
    IsString,
    IsUUID,
    MaxLength,
} from 'class-validator';
import { Transform } from "class-transformer";

export class UpdateMunicipalityDTO {
    @ApiProperty({
        example: 'Marianao',
        description: 'The name of the municipality',
    })
    @IsString()
    @IsOptional()
    @MaxLength(100)
    name?: string;

    @ApiProperty({
        example: 19.99,
        description: 'Price of delivery in dollars',
    })
    @Transform(({ value }) => Number(value))
    @IsOptional()
    @IsNumber()
    @IsPositive()
    basePrice?: number;

    @ApiProperty({
        example: 24,
        description: 'Min hours to do delivery',
    })
    @Transform(({ value }) => Number(value))
    @IsNumber()
    @IsOptional()
    minHours?: number;

    @ApiProperty({
        example: 48,
        description: 'Max hours to do delivery',
    })
    @Transform(({ value }) => Number(value))
    @IsNumber()
    @IsOptional()
    maxHours?: number;

    @ApiProperty({
        example: 'a6e0c570-be0e-4a7d-93c5-767a7767890b',
        description: 'The id of the province',
    })
    @IsOptional()
    @IsUUID()
    provinceId?: string;
}
