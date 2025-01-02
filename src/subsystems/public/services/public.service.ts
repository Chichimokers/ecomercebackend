import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ProductService } from '../../products/services/product.service';
import { CategoryService } from '../../category/services/category.service';

@Injectable()
export class PublicService {
    constructor(
        @Inject(ProductService) private readonly productService: ProductService,
        @Inject(CategoryService) private readonly categoryService: CategoryService,
    ) {}

    // *--- For Home View ---* //
    public async getHomeView(limit: number) {
        return await this.productService.getProductsHome(limit);
    }

    // *--- For Products View ---* //
    public async getProductsPage(
        page: number,
        limit: number,
        filters: {
            categoryIds?: number[];
            subCategoryIds?: number[];
            prices?: number[];
            rate?: number;
        } = {},
    ) {
        const hasFilters: boolean = !!(
            filters.categoryIds?.length ||
            filters.subCategoryIds?.length ||
            filters.prices?.length ||
            filters.rate
        );

        const productsData = hasFilters
            ? await this.productService.getFilteredProducts(filters)
            : await this.productService.getProducts(page, limit);

        const categories = hasFilters
            ? await this.categoryService.getCategoriesWithSubCategories(
                  filters.categoryIds,
              )
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

    // *--- Search Product By Name ---* //
    public async getProductByName(name: string) {
        if (!name) {
            throw new BadRequestException('Name is required');
        }

        const products = await this.productService.searchProductByName(name);

        if (products.length === 0) {
            throw new NotFoundException('Product not found');
        }

        return products;
    }
}
