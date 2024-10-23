import { IsNotEmpty } from "class-validator";

import { IsNumber, IsString, IsEmail, IsEnum, IsArray, ValidateNested } from 'class-validator';
import { BaseDto } from 'src/common/dto/base.dto';


export class productDto extends BaseDto {
    
    @IsString()
    image: string;

    @IsString()
    @IsNotEmpty()
    name?: string;


    @IsNumber()
    price?: number;


    @IsNotEmpty()
    quantity?: number;
}
