import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { BaseDto } from 'src/common/dto/base.dto';

export class addCartDTO extends BaseDto {
  @ApiProperty({
        example: "123.25",
        description: "A valid quantity",
    })
    @IsNotEmpty()
    @IsNumber({}, { message: 'Please provide valid quantity.' })   
    quantity: number;

    @ApiProperty({
        example: "",
        description: "A valid productID",
    })
    @IsNotEmpty()
    @IsNumber({}, { message: 'Please provide valid product ID' })
    productId: number; // ID del producto
}
