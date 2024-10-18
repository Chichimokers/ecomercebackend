import {
    IsAlphanumeric,
    IsEmail,
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsString,
    Matches,
    MinLength,
    MaxLength,
    IsArray,
    ArrayNotEmpty,
    IsOptional,
    IsNumber
} from 'class-validator';

import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseDto } from 'src/common/dto/base.dto';


const passwordRegEx =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{8,20}$/;

export class CreateUserDto extends BaseDto {

    @ApiProperty({
        example: "User name",
        description: "Name of your user",
    })

    @Transform(({ value }) => value.trim())
    @IsString()
    @MinLength(2, { message: 'Name must have atleast 2 characters.' })
    @MaxLength(20, { message: 'Name must have max 20 characters.' })
    @IsNotEmpty()
    name: string;


    @ApiProperty({
        example: "User Email",
        description: "A valid email address",
    })
    @IsEmail({}, { message: 'Please provide valid Email.' })
    email: string;

    @ApiProperty({
        example: "User password",
        description: "A valid user password",
    })
    @Transform(({ value }) => value.trim())
    @IsNotEmpty()
    password: string;

    @ApiProperty({
        example: "1",
        description: "1-User 2-Admin",
    })
    @IsNumber()
    @IsNotEmpty()
    rol :number;

}