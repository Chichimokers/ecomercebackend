import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class UpdateCategoryDTO {
    @ApiProperty({
        example: "Food",
        description: "The name of the category"
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    name?: string;
}