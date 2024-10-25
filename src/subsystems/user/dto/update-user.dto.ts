import { ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsEmail,
    IsNotEmpty,
    IsString,
    MinLength,
    MaxLength,
    IsNumber
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


    @ApiPropertyOptional({
        example: "1",
        description: "1-User 2-Admin",
    })
    @IsNumber()
    @IsNotEmpty()
    rol?:number


}
