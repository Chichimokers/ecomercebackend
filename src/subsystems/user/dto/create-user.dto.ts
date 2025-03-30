import {
    IsEmail,
    IsNotEmpty,
    IsString,
    MinLength,
    MaxLength,
    IsNumber
} from "class-validator";

import { Transform } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { BaseDto } from "../../../common/dto/base.dto";

export class CreateUserDto extends BaseDto {
    @ApiProperty({
        example: "User name",
        description: "Name of your user"
    })
    @Transform(({ value }) => value.trim())
    @IsString()
    @MinLength(2, { message: "Name must have at least 2 characters." })
    @MaxLength(128, { message: "Name must have max 128 characters." })
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        example: "User Email",
        description: "A valid email address"
    })
    @IsEmail({}, { message: "Please provide valid Email." })
    email: string;

    @ApiProperty({
        example: "User password",
        description: "A valid user password"
    })
    @Transform(({ value }) => value.trim())
    @IsNotEmpty()
    password: string;

    @ApiProperty({
        example: "1",
        description: "1-User 2-Admin"
    })
    @IsNumber()
    @IsNotEmpty()
    rol: number;
}