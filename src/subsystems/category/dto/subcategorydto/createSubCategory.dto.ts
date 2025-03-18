import { IsNotEmpty, IsString, IsUUID, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateSubCategoryDTO {
    @ApiProperty({
        example: "Fruits",
        description: "The name of the category",
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    name: string;

    @ApiProperty({
        example: "b667f2af-19ad-4da6-a609-5c72cfe23630",
        description: "The id of the category",
        required: true,
    })
    @IsNotEmpty()
    @IsUUID()
    categoryId: string;
}