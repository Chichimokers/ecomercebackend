import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class createProvinceDTO {
    @ApiProperty({
        example: "Santiago de Cuba",
        description: "The name of the province",
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    name: string;
}