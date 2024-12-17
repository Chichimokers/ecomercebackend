import { ProductDTO } from "../productsDTO/getproducts.dto";
import { ApiProperty } from "@nestjs/swagger";

export class HomeViewDTO {
    @ApiProperty({ type: [ProductDTO], description: "Products" })
    products: ProductDTO[];
}