import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CalcEnvioDTO {
    @ApiProperty({
        description: 'ID of the order',
        example: 1
    })
    @IsNotEmpty()
    @IsUUID()
    orderId: string;
}