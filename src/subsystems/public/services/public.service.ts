import { Inject, Injectable } from "@nestjs/common";
import { ProductService } from "../../products/services/product.service";
import { CategoryService } from "../../category/services/category.service";
import { badRequestException, notFoundException } from "../../../common/exceptions/modular.exception";
import { ProvinceService } from "../../locations/service/province.service";
import { Cache } from "@nestjs/cache-manager";
import { roundMinor } from "../utils/roundMinor";
import { IFilterProduct } from "../../../common/interfaces/filters.interface";
import { CategoryEntity } from "../../category/entity/category.entity";
import { MunicipalityService } from "../../locations/service/municipality.service";
import { MunicipalityEntity } from "../../locations/entity/municipality.entity";
import { ProvinceEntity } from "../../locations/entity/province.entity";
import { SearchproductDTO } from "../dto/frontsDTO/productsDTO/searchproduct.dto";
import { ShippingDTO } from "../dto/frontsDTO/ordersDTO/shippingPrice.dto";

@Injectable()
export class PublicService {
    constructor(
        @Inject(ProductService) private readonly productService: ProductService,
        @Inject(CategoryService)
        private readonly categoryService: CategoryService,
        @Inject(ProvinceService)
        private readonly provinceService: ProvinceService,
        @Inject(MunicipalityService)
        private readonly municipalityService: MunicipalityService,
        @Inject(Cache) private cacheManager: Cache
    ) {
    }

    // *--- For Home View ---* //
    public async getHomeView(limit: number) {
        return await this.productService.getProductsHome(limit);
    }

    // *--- For Products View ---* //
    public async getProductsPage(
        page: number = 0,
        limit: number = 30,
        filters: IFilterProduct = {}
    ) {
        const productsData = await this.productService.getFilteredProducts(filters, page, limit);
        const minAndMax = await this.productService.getMinAndMaxPrice(filters);
        const categories: CategoryEntity[] = await this.categoryService.getCategoriesWithSubCategories(filters.categoryIds);

        notFoundException(productsData.products, "Products");

        const { previousUrl, nextUrl, totalPages } = productsData.urls;

        return {
            products: productsData.products,
            previousUrl: previousUrl,
            nextUrl: nextUrl,
            totalPages: totalPages,
            minPrice: minAndMax.minPrice,
            maxPrice: minAndMax.maxPrice,
            categories
        };
    }

    // *--- Search Product By Name ---* //
    public async getProductByName(dto: SearchproductDTO): Promise<any> {
        const products = await this.productService.searchProductByName(dto.name, dto.province);

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
    public async getCategories(): Promise<CategoryEntity[]> {
        return await this.categoryService.getCategoriesWithSubCategories();
    }

    // *--- Get Main View Products, Categories, Provinces ---* //
    public async getMainViewInfo(): Promise<any> {
        return {
            provinces: await this.provinceService.countProvinces(),
            products: roundMinor(await this.productService.countProducts()),
            category: await this.categoryService.countCategories()
        };
    }

    // *--- Get Provinces And Municipalitys ---* //
    public async getProvinces(): Promise<ProvinceEntity[]> {
        return await this.provinceService.getProvincesMapped();
    }

    // *--- Get Municipalitys By Province ---* //
    public async getMunicipalities(id: string): Promise<MunicipalityEntity[]> {
        const municipalities: MunicipalityEntity[] = await this.municipalityService.getMunicipalitysByProvince(id);

        notFoundException(municipalities, "Municipalities");

        return municipalities;
    }

    public async getMunicipality(id: string): Promise<MunicipalityEntity> {
        const municipality: MunicipalityEntity = await this.municipalityService.getMunicipality(id);

        notFoundException(municipality, "Municipality");

        return municipality;
    }

    public async getShippingPrice(dto: ShippingDTO) {
        const municipality: MunicipalityEntity = await this.municipalityService.getMunicipality(dto.municipality);
        let shippingPrice: number = municipality.basePrice;

        for (const price of municipality.prices) {
            console.log(price);
            if(dto.total_weight >= price.minWeight) {
                shippingPrice = price.price;
            }
        }

        return shippingPrice;
    }
}
