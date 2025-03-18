import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { ProvinceService } from "../../locations/service/province.service";
import { Cache } from "@nestjs/cache-manager";
import { ProvinceEntity } from "../../locations/entity/province.entity";
import { ProductService } from "../../products/services/product.service";
import { IFilterProduct } from "../../../common/interfaces/filters.interface";
import { IPagination } from "../../../common/interfaces/pagination.interface";
import { CategoryService } from "../../category/services/category.service";

@Injectable()
export class InitializeSchedule implements OnModuleInit {
    constructor(
        @Inject(ProvinceService)
        private provinceService: ProvinceService,
        @Inject(ProductService)
        private productService: ProductService,
        @Inject(CategoryService)
        private categoryService: CategoryService,
        @Inject(Cache)
        private cacheManager: Cache
    ) {

    }

    async onModuleInit(): Promise<void> {
        console.log("Inicializando cache!");
        await this.run();
    }

    async run(): Promise<void> {
        const provinces: ProvinceEntity[] = await this.provinceService.getProvincesMapped();

        for (const province of provinces) {
            const filter: IFilterProduct = {
                provinceId: province.id,
            }

            for (let i = 1; i < 4; i++) {
                const pagination: IPagination = {
                    page: i,
                    limit: 30,
                }

                const [productsData, minAndMax] = await Promise.all([
                    this.getProducts(filter, pagination),
                    this.productService.getMinAndMaxPrice(filter),
                ])

                const { previousUrl, nextUrl, totalPages } = productsData.urls;

                await this.cacheManager.set(`/public/products?page=${i}&limit=30&province=${province.id}{"page":"${i}","limit":"30","province":"${province.id}"}`,
                    {
                        products: productsData.products,
                        previousUrl: previousUrl,
                        nextUrl: nextUrl,
                        totalPages: totalPages,
                        minPrice: minAndMax.minPrice,
                        maxPrice: minAndMax.maxPrice,
                    });
            }
        }
        // '/public/products?page=2&limit=30&province=0ec3d2c5-1efd-472e-9ffe-07bd345162dc{"page":"2","limit":"30","province":"0ec3d2c5-1efd-472e-9ffe-07bd345162dc"}'
    }

    async getProducts(filters: IFilterProduct, pagination: IPagination) {
        return await this.productService.getFilteredProducts(filters, pagination);
    }


}