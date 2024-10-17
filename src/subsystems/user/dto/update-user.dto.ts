import { PartialType, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import {
    IsAlphanumeric,
    IsEmail,
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsOptional,
    ArrayNotEmpty,
    IsArray,
    IsString,
    Matches,
    MinLength,
    MaxLength,
    isString,
    isNotEmpty
} from 'class-validator';
import { Transform } from 'class-transformer';

// export class UpdateUserDto extends PartialType(CreateUserDto) {

export class UpdateUserDto {

    @ApiPropertyOptional({
        example: "User name",
        description: "Name of your user",
    })
    @Transform(({ value }) => value.trim())
    @IsString()
    @MinLength(2, { message: 'Name must have atleast 2 characters.' })
    @MaxLength(20, { message: 'Name must have max 20 characters.' })
    @IsNotEmpty()
    name?: string;


    @ApiPropertyOptional({
        example: "User Email",
        description: "A valid email address",
    })
    @IsEmail({}, { message: 'Please provide valid Email.' })
    email?: string;

    @IsString()
    @IsNotEmpty()
    rol?:string


}
