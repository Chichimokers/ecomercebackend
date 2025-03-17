import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { BaseDto } from "src/common/dto/base.dto";

export class SingUpBodyVerifcation  extends BaseDto {
    @IsNotEmpty()
    @IsEmail({}, { message: 'Please provide valid Email.' })
    @ApiProperty({
        example: "ernest@gmail.com",
        description: "a valid mail",
    })
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        example: "234e3",
        description: "a valid code ",
    })
    readonly code: string;
}