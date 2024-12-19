import { Injectable, NotFoundException } from "@nestjs/common";
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
        const hasFilters: boolean = !!(filters.categoryIds?.length || filters.subCategoryIds?.length);

        const productsData =
            hasFilters
                ? await this.productService.getFilteredProducts(filters)
                : await this.productService.getProducts(page, limit);

        const categories =
            hasFilters
                // TODO - Check if it is necessary to get categories with subcategories
                ? await this.categoryService.getCategoriesWithSubCategories(filters.categoryIds)
                : await this.categoryService.getCategories();


        if (productsData.products.length === 0) {
            throw new NotFoundException('Not found products!');
        }

        return {
            products: productsData.products,
            previousUrl: productsData.previousUrl,
            nextUrl: productsData.nextUrl,
            categories,
        };
    }
}
