import { GetProductDTO, ProductDTO } from "../productsDTO/getproducts.dto";
import { GetCategoriesDTO } from "../categoryDTO/getCategories.dto";
import { ApiProperty } from "@nestjs/swagger";


export class ProductsViewDTO {
    @ApiProperty({ type: ProductDTO, description: "Products" })
    products: GetProductDTO;

    @ApiProperty({ description: "List of categories", type: [GetCategoriesDTO] })
    categories: GetCategoriesDTO;
}