import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { BaseDto } from "src/common/dto/base.dto";

export class SingUpBody  extends BaseDto {
    @Transform(({ value }) => value.trim())
    @IsString()
    @MinLength(2, { message: 'Name must have atleast 2 characters.' })
    @MaxLength(20, { message: 'Name must have max 20 characters.' })
    @IsNotEmpty()
    @ApiProperty({
        example: "ernest",
        description: "userame used in signup",
    })
    readonly username: string;

    @IsNotEmpty()
    @ApiProperty({
        example: "0312334R4.",
        description: "password",
    })
    readonly password: string;

    @IsNotEmpty()
    @IsEmail({}, { message: 'Please provide valid Email.' })
    @ApiProperty({
        example: "ernest@gmail.com",
        description: "a valid mail",
    })
    readonly email: string;
}