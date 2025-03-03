import {
    Inject,
    Injectable
} from "@nestjs/common";
import { ProductService } from "../../products/services/product.service";
import { CategoryService } from "../../category/services/category.service";
import { badRequestException, notFoundException } from "../../../common/exceptions/modular.exception";
import { ProvinceService } from "../../locations/service/province.service";
import { Cache } from '@nestjs/cache-manager';
import { roundMinor } from "../utils/roundMinor";

@Injectable()
export class PublicService {
    constructor(
        @Inject(ProductService) private readonly productService: ProductService,
        @Inject(CategoryService)
        private readonly categoryService: CategoryService,
        @Inject(ProvinceService)
        private readonly provinceService: ProvinceService,
        @Inject(Cache) private cacheManager: Cache,
    ) {
    }

    // *--- For Home View ---* //
    public async getHomeView(limit: number) {
        return await this.productService.getProductsHome(limit);
    }

    // *--- For Products View ---* //
    public async getProductsPage(
        page: number,
        limit: number,
        filters: {
            categoryIds?: string[];
            subCategoryIds?: string[];
            prices?: number[];
            rate?: number;
        } = {}
    ) {
        const hasFilters: boolean = !!(
            filters.categoryIds?.length ||
            filters.subCategoryIds?.length ||
            filters.prices?.length ||
            filters.rate
        );

        const productsData = hasFilters
            ? await this.productService.getFilteredProducts(
                filters,
                page,
                limit
            )
            : await this.productService.getProducts(page, limit);

        const categories = hasFilters
            ? await this.categoryService.getCategoriesWithSubCategories(
                filters.categoryIds
            )
            : await this.categoryService.getCategoriesWithSubCategories();

        notFoundException(productsData.products, "Products");

        const { previousUrl, nextUrl, totalPages } = productsData.urls;

        return {
            products: productsData.products,
            previousUrl: previousUrl,
            nextUrl: nextUrl,
            totalPages: totalPages,
            categories
        };
    }

    // *--- Search Product By Name ---* //
    public async getProductByName(name: string) {
        badRequestException(name, "Name");

        const products = await this.productService.searchProductByName(name);

        notFoundException(products, "Product");

        return products;
    }

    // *--- Get Product Detail ---* //
    public async getProductDetails(id: string) {
        badRequestException(id, "ID");

        return await this.productService.getProductDetails(id);
    }

    public async getProductRelation(id: string) {
        badRequestException(id, "ID");

        return await this.productService.getRelations(id);
    }

    // *--- Get Categories ---* //
    public async getCategories() {
        return await this.categoryService.getCategoriesWithSubCategories();
    }

    // *--- Get Main View Products, Categories, Provinces ---* //
    public async getMainViewInfo() {
        const cacheManage: any = await this.cacheManager.get('counters');

        if (cacheManage) {
            return cacheManage;
        }

        const data = {
            provinces: await this.provinceService.countProvinces(),
            products: roundMinor(await this.productService.countProducts()),
            category: await this.categoryService.countCategories(),
        }

        await this.cacheManager.set('counters', data);

        return data
    }
}
