import { IsNotEmpty, MaxLength, IsString, IsNumber, IsPositive, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class createMunicipalityDTO {
    @ApiProperty({
        example: "Guanacabibe",
        description: "The name of the municipality",
    })
    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    name: string;

    @ApiProperty({
        example: 10.99,
        description: "The price of delivery",
    })
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    price: number;

    @ApiProperty({
        example: "a6e0c570-be0e-4a7d-93c5-767a7767890b",
        description: "Province identifier for relation",
    })
    @IsNotEmpty()
    @IsUUID()
    province: string;
}