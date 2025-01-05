import { IsNumber, IsString, IsEmail } from 'class-validator';
import { BaseDto } from "../../../common/dto/base.dto";

export class UserDto extends BaseDto {
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsNumber()
    rol : number;
}
