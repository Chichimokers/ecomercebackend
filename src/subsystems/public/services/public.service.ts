import { Injectable } from '@nestjs/common';
import { ProductService } from '../../products/services/product.service';
import { CategoryService } from '../../category/services/category.service';

@Injectable()
export class PublicService {
    constructor(
        private readonly productService: ProductService,
        private readonly categoryService: CategoryService,
    ) {}

    // *--- For Home View ---* //
    public async getHomeView() {
        return await this.productService.getProductsHome();
    }

    // *--- For Products View ---* //
    public async getProductsPage(
        page: number,
        limit: number,
        filters: { categoryIds?: number[]; subCategoryIds?: number[] } = {},
    ) {
        const productsData =
            filters.categoryIds?.length || filters.subCategoryIds?.length
                ? await this.productService.getFilteredProducts(filters)
                : await this.productService.getProducts(page, limit);
        const categories =
            await this.categoryService.getCategoriesWithSubCategories();

        return {
            products: productsData.products,
            previousUrl: productsData.previousUrl,
            nextUrl: productsData.nextUrl,
            categories,
        };
    }
}
