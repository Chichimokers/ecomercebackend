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
            ? await this.productService.getFilteredProducts(filters, page, limit)
            : await this.productService.getProducts(page, limit);

        const categories = hasFilters
            ? await this.categoryService.getCategoriesWithSubCategories(
                  filters.categoryIds,
              )
            : await this.categoryService.getCategoriesWithSubCategories();

        console.log(categories);

        if (productsData.products.length === 0) {
            throw new NotFoundException('Not found products!');
        }

        const { previousUrl, nextUrl, totalPages } = productsData.urls;

        return {
            products: productsData.products,
            previousUrl: previousUrl,
            nextUrl: nextUrl,
            totalPages: totalPages,
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

    // *--- Get Product Detail ---* //
    public async getProductDetails(id: number){
        if (!id) {
            throw new BadRequestException('ID is required');
        }

        return await this.productService.getProductDetails(id);
    }

    // *--- Get Categories ---* //
    public async getCategories() {
        return await this.categoryService.getCategoriesWithSubCategories();
    }
}
