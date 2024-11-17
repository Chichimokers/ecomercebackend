import { IsNumber, IsString, IsEmail, IsEnum, IsArray, ValidateNested } from 'class-validator';
import { BaseDto } from 'src/common/dto/base.dto';

export class UserDto extends BaseDto {
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsNumber()
    rol : number;
}
