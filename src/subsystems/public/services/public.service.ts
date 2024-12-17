import { Injectable } from "@nestjs/common";
import { ProductService } from "../../products/services/product.service";
import { CategoryService } from "../../category/services/category.service";

@Injectable()
export class PublicService {
    constructor(
        private readonly productService: ProductService,
        private readonly categoryService: CategoryService,
    ) {
    }

    public async getProductsPage(page: number, limit: number){
        const [productsData, categories] = await Promise.all([
            this.productService.getProducts(page, limit),
            this.categoryService.getCategoriesWithSubCategories(),
        ]);

        return {
            products: productsData.products,
            previousUrl: productsData.previousUrl,
            nextUrl: productsData.nextUrl,
            categories,
        };
    }
}