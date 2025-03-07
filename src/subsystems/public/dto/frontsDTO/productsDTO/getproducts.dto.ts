// src/subsystems/public/dto/ProductDTO.ts
import { ApiProperty } from "@nestjs/swagger";
//import { OfferEntity } from "../../discounts/entity/offers.entity";

export class DiscountDTO {
    @ApiProperty({ example: 10, description: "Discount min" })
    min: number;

    @ApiProperty({ example: 1, description: "Discount reduction" })
    reduction: number;
}

export class ProductDTO {
    @ApiProperty({ example: "8bebf95d-8667-4291-9265-8074db4ebe99", description: "Identifier" })
    id: string;

    @ApiProperty({ example: null, description: "Product image", nullable: true })
    image: string | null;

    @ApiProperty({ example: "Meat", description: "Product name" })
    name: string;

    @ApiProperty({ example: 123, description: "Product price" })
    price: number;

    @ApiProperty({
        example: "Short Description",
        description: "Short description to show in cards",
    })
    short_description: string;

    @ApiProperty({
        example: "Large Description",
        description: "Short description to show in cards",
    })
    description: string;

    @ApiProperty({
        example: 26,
        description: "Average rating"
    })
    averageRating: number;

    @ApiProperty({
        example: "Food",
        description: "Product category"
    })
    category: string;

    @ApiProperty({
        example: "Fruits",
        description: "Product subcategory"
    })
    subCategory: string;

    @ApiProperty({
        type: DiscountDTO,
        description: "Product discount"
    })
    discount: DiscountDTO;
}

export class GetFindsProductDTO {
    @ApiProperty({ description: "List of finds products", type: [ProductDTO]})
    products: ProductDTO[];
}

export class GetProductDTO {
    @ApiProperty({ description: "List of products", type: [ProductDTO] })
    products: ProductDTO[];

    @ApiProperty({ example: null, description: "URL for the previous page", nullable: true })
    previousUrl: string | null;

    @ApiProperty({ example: null, description: "URL for the next page", nullable: true })
    nextUrl: string | null;

    @ApiProperty({ example: 5, description: "Total of pages you would get." })
    totalPages: number;
}
