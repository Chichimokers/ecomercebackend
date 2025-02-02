import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { BaseDto } from 'src/common/dto/base.dto';

export class paydto extends BaseDto {
    @ApiProperty({
        example: "ID order",
        description: "A valid quantity",
    })
    @IsNotEmpty()
    @IsNumber()
    id:string
  
}
