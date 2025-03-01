import { ApiProperty } from '@nestjs/swagger';
import {
    IsNumber,
    IsOptional,
    IsPositive,
    IsString,
    IsUUID,
    MaxLength,
} from 'class-validator';

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
    @IsOptional()
    @IsNumber()
    @IsPositive()
    price?: number;

    @ApiProperty({
        example: 'a6e0c570-be0e-4a7d-93c5-767a7767890b',
        description: 'The id of the province',
    })
    @IsOptional()
    @IsUUID()
    provinceId?: string;
}
