import { IsNotEmpty, IsString, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCategoryDTO {
    @ApiProperty({
        example: "Food",
        description: "The name of the category"
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    name: string;
}