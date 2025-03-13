import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { BaseDto } from "../../../common/dto/base.dto";
import { User } from '../../user/entities/user.entity';

export class CreateOrderDTO extends BaseDto {
    @ApiProperty({
        example: "User structure, no required",
        description: "A valid quantity, no required",
    })
    @IsNotEmpty()
    user: User

    @ApiProperty({
        example: "+5358126024",
        description: "a phone number",
    })
    @IsNotEmpty()
    @IsString()
    phone: string

    @ApiProperty({
        example: "+5358126024",
        description: "a phone number",
    })
    @IsOptional()
    @IsString()
    aux_phone?: string

    @ApiProperty({
        example: "Finca tirabeque edificio 2 apartamento 5 ",
        description: "an adress",
    })
    @IsNotEmpty()
    @IsString()
    address :string

    @ApiProperty({
        example: "031229681709",
        description: "a valid cuban id",
    })
    @IsNotEmpty()
    @IsString()
    CI :string

    @ApiProperty({
        example: 'a6e0c570-be0e-4a7d-93c5-767a7767890b',
        description: 'The id of the province',
    })
    @IsNotEmpty()
    @IsUUID()
    municipality: string;
}
