import { ApiProperty } from "@nestjs/swagger";

export class SubCategoryDTO {
    @ApiProperty({ example: 1, description: "Subcategory identifier" })
    id: number;

    @ApiProperty({ example: "Fruits", description: "Subcategory name" })
    name: string;
}

export class GetCategoriesDTO {
    @ApiProperty({ example: 1, description: "Category identifier" })
    id: number;

    @ApiProperty({ example: "Food", description: "Category name" })
    name: string;

    @ApiProperty({ description: "List of subcategories", type: [SubCategoryDTO] })
    subcategories: SubCategoryDTO[];
}

