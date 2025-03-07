import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CalcEnvioDTO {
    
    @ApiProperty({
        description: 'weight in KG',
        example: 1
    })
    @IsNotEmpty()
    @IsUUID()
    weight: number;

    @ApiProperty({
        description: 'ID of the municipality',
        example: 1
    })
    @IsNotEmpty()
    municipaliti :string
}