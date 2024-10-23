import { IsNotEmpty } from "class-validator";

import { IsNumber, IsString, IsEmail, IsEnum, IsArray, ValidateNested } from 'class-validator';
import { BaseDto } from 'src/common/dto/base.dto';
import { ProductClass } from "../enums/products.class.enum";


export class productDto extends BaseDto {
    
    @IsString()
    image: string;

    @IsString()
    @IsNotEmpty()
    name?: string;
    
    @IsNotEmpty()
    @IsNumber()
    class?: ProductClass;
    

    @IsNumber()
    price?: number;


    @IsNotEmpty()
    quantity?: number;
}
