import { ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsEmail,
    IsString,
    MinLength,
    MaxLength,
    IsNumber, IsOptional
} from "class-validator";
import { Transform } from 'class-transformer';

export class UpdateUserDto {
    @ApiPropertyOptional({
        example: "User name",
        description: "Name of your user",
    })
    @Transform(({ value }) => value.trim())
    @IsString()
    @MinLength(2, { message: 'Name must have at least 2 characters.' })
    @MaxLength(128, { message: 'Name must have max 128 characters.' })
    @IsOptional()
    name?: string;

    @ApiPropertyOptional({
        example: "User Email",
        description: "A valid email address",
    })
    @IsEmail({}, { message: 'Please provide valid Email.' })
    @IsOptional()
    email?: string;

    @ApiPropertyOptional({
        example: "1",
        description: "1-User 2-Admin",
    })
    @IsNumber()
    @IsOptional()
    rol?:number
}
