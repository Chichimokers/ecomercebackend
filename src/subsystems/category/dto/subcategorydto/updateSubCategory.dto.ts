import { IsNotEmpty, IsString, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { CategoryEntity } from "../../entity/category.entity";
import { Type } from "class-transformer";

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
        example: "1",
        description: "The id of the category"
    })
    @IsNotEmpty()
    @Type(() => CategoryEntity)
    categoryId?: CategoryEntity;
}