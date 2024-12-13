// src/subsystems/public/dto/ProductDTO.ts
import { ApiProperty } from "@nestjs/swagger";
//import { OfferEntity } from "../../discounts/entity/offers.entity";

export class ProductDTO {
    @ApiProperty({ example: 1, description: "Identifier" })
    id: number;

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
        description: "Calificacion total del producto para calcularse con la" +
            " cantidad de calificaciones."
    })
    qualification: number;

    @ApiProperty({
        example: 6,
        description: "Cantidad de usuarios que calificaron el producto"
    })
    qualification_quantity: number;

    /*@ApiProperty({})
    offers: OfferEntity[];*/

    @ApiProperty({
        example: "Food",
        description: "Product category"
    })
    product_category: string;

    @ApiProperty({
        example: "Fruits",
        description: "Product subcategory"
    })
    product_subcategory: string;
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