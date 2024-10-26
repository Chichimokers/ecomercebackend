import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { BaseDto } from 'src/common/dto/base.dto';
import { CartEntity } from 'src/subsystems/cart/entity/cart.entity';
import { User } from 'src/subsystems/user/entities/user.entity';

export class paydto extends BaseDto {
    @ApiProperty({
        example: "Order ID",
        description: "A valid quantity",
    })
    @IsNotEmpty()
    @IsNumber()
    id:number
  
}
