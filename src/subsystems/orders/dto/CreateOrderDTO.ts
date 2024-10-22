import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { BaseDto } from 'src/common/dto/base.dto';
import { CartEntity } from 'src/subsystems/cart/entity/cart.entity';
import { User } from 'src/subsystems/user/entities/user.entity';

export class CreateOrderDTO extends BaseDto {
  @ApiProperty({
        example: "User structure",
        description: "A valid quantity",
    })
    @IsNotEmpty()
    user:User
    @ApiProperty({
        example: "+5358126024",
        description: "a phone number",
    })
    @IsNotEmpty()
    @IsString()
    phone :string
    @ApiProperty({
        example: "Finca tirabeque edificio 2 apartamento 5 ",
        description: "an adress",
    })
    @IsNotEmpty()
    @IsString()
    address :string

    @ApiProperty({
        example: "031229681709",
        description: "a valid cuban id",
    })
    @IsNotEmpty()
    @IsString()
    CI :string
    @ApiProperty({
        example: "Cart structure",
        description: "a valid cuban id",
    })
    @IsNotEmpty()
    carts: CartEntity[];
}
