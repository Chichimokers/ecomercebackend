import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';

export class addCartDTO {
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
