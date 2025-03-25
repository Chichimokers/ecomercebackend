import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty } from "class-validator";
import { BaseDto } from "src/common/dto/base.dto";

export class ChangepassPetition  extends BaseDto {
    @Transform(({ value }) => value.trim())
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({
        example: "ernest@gmail.com",
        description: "mail used in signup",
    })
    readonly email: string;
}
export class ChangepassVerify  extends BaseDto {
    @Transform(({ value }) => value.trim())
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({
        example: "ernest@gmail.com",
        description: "mail used in signup",
    })
    readonly email: string;

    @ApiProperty({
        example: "123233",
        description: "password",
    })
    @IsNotEmpty()
    readonly newpass: string;
}
