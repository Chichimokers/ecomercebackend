import { BaseDto } from "src/common/dto/base.dto";
import { Transform } from "class-transformer";
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class OrderDto extends BaseDto {
    @Transform(({ value }) => value.trim())
    @IsString()
    @MinLength(2, { message: 'Name must have atleast 2 characters.' })
    @MaxLength(20, { message: 'Name must have max 20 characters.' })
    @IsNotEmpty()
    @ApiProperty({
        example: "ernest",
        description: "Username used in signup"
    })
    user: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: "+1 123 456 7890",
        description: "Phone number",
    })
    phone: string;

    @IsString()
    @IsNotEmpty()
    address: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: "12334566789",
        description: "CI, DNI or SSN. Personal identifier"
    })
    CI: string;

    @IsNumber()
    @IsNotEmpty()
    subTotal: number;

    @IsBoolean()
    @IsNotEmpty()
    @ApiProperty({
        example: true,
        description: "Order status, true if pending"
    })
    pending: boolean;

    @IsArray()
    @IsNotEmpty()
    @ApiProperty({
        example: ["1", "2", "3"],
        description: "List of carts IDs in the order"
    })
    carts: string[];
    
}