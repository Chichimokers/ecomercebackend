import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class UpdateSubCategoryDTO {
    @ApiProperty({
        example: "Fruits",
        description: "The name of the category"
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    name?: string;

    @ApiProperty({
        example: "a6e0c570-be0e-4a7d-93c5-767a7767890b",
        description: "The id of the category"
    })
    @IsNotEmpty()
    @IsUUID()
    categoryId?: string;
}