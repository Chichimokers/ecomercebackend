// src/subsystems/public/dto/ProductDTO.ts
import { ApiProperty } from "@nestjs/swagger";
import { BaseDto } from "../../../common/dto/base.dto";

export class ProductDTO extends BaseDto {
    @ApiProperty({ example: 1, description: "Identifier" })
    id: number;

    @ApiProperty({ example: "2024-11-16T23:15:49.753Z", description: "Creation date" })
    created_at: string;

    @ApiProperty({ example: "2024-11-25T15:32:02.922Z", description: "Last update date" })
    updated_at: string;

    @ApiProperty({ example: null, description: "Deletion date", nullable: true })
    deleted_at: string | null;

    @ApiProperty({ example: null, description: "Product image", nullable: true })
    image: string | null;

    @ApiProperty({ example: "Meat", description: "Product name" })
    name: string;

    @ApiProperty({ example: 123, description: "Product price" })
    price: number;

    @ApiProperty({ example: 1, description: "Product class" })
    class: number;

    @ApiProperty({ example: 122, description: "Product quantity" })
    quantity: number;
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
}