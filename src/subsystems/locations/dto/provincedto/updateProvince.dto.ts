import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateProvinceDTO {
    @ApiProperty({
        example: "Santiago de Cuba",
        description: "The name of the province",
    })
    @IsString()
    @IsOptional()
    @MaxLength(100)
    name?: string;
}