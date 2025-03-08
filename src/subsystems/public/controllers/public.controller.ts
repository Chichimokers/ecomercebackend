import {
    Body,
    Controller,
    Get, Inject, Param,
    ParseUUIDPipe,
    Post,
    Query,
    Req
} from "@nestjs/common";
import { ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { PublicService } from "../services/public.service";
import { HomeViewDTO } from "../dto/frontsDTO/views/homeView.dto";
import { ProductDTO } from "../dto/frontsDTO/productsDTO/getproducts.dto";
import { GetCategoriesDTO } from "../dto/frontsDTO/categoryDTO/getCategories.dto";
import {
    ProductPublicApiDoc,
    ProductPublicQuery
} from "../../products/decorators/public.decorator";
import { IProductsFilters } from "../../products/interfaces/basequery.interface";
import { badRequestException } from "../../../common/exceptions/modular.exception";
import { IFilterProduct } from "../../../common/interfaces/filters.interface";
import { SearchproductDTO } from "../dto/frontsDTO/productsDTO/searchproduct.dto";
import { ShippingDTO } from "../dto/frontsDTO/ordersDTO/shippingPrice.dto";
import { Cache } from "@nestjs/cache-manager";
import { CACHE_ORM } from "../../../common/constants/cahetimesORM.constants";


@ApiTags("public")
@Controller("public")
export class PublicController {
    constructor(private publicService: PublicService,
        @Inject(Cache) private cacheManager: Cache,
    ) {
    }

    // *--- For Home View ---* //
    @Get("/home")
    @ApiQuery({ name: "limit", required: false, type: Number })
    @ApiResponse({ status: 200, type: HomeViewDTO })
    public getHomeView(@Query("limit") limit: number = 20) {
        limit = Number(limit);
        return this.publicService.getHomeView(limit);
    }

    // *--- For Home View ---* //
    @Post("/search")
    public searchProduct(@Body() body: SearchproductDTO) {
        badRequestException(body.name, "Name");
        return this.publicService.getProductByName(body);
    }

    // *--- For Products View ---* //
    @Get("/products")
    @ProductPublicApiDoc()
    public async getProductView(@ProductPublicQuery() query: IProductsFilters) {
        if (query.categoryIds)
            badRequestException(query.categoryIds, "CategoryIDS");
        if (query.subCategoryIds)
            badRequestException(query.subCategoryIds, "SubCategoryIDS");
        if (query.prices) badRequestException(query.prices, "Prices");

        const filters: IFilterProduct = {
            categoryIds: query.categoryIds,
            subCategoryIds: query.subCategoryIds,
            prices: query.prices,
            rate: query.rate,
            provinceId: query.province
        };

        return await this.publicService.getProductsPage(
            +query.page || 0,
            +query.limit || 30,
            filters
        );
    }

    // *--- For Products Details View ---* //
    @Get("/product-details")
    @ApiQuery({
        name: "id",
        required: true,
        type: String,
        description: "ID of the product"
    })
    @ApiResponse({ status: 200, type: ProductDTO })
    @ApiResponse({ status: 400, description: "Missing or invalid id" })
    public getProductDetails(@Query("id", new ParseUUIDPipe()) id: string) {
        return this.publicService.getProductDetails(id);
    }

    @Get("/product-relations")
    @ApiQuery({
        name: "id",
        required: true,
        type: Number,
        description: "ID of the product"
    })
    @ApiResponse({ status: 200, type: [ProductDTO] })
    @ApiResponse({ status: 400, description: "Missing or invalid id" })
    public getProductRelation(@Query("id", new ParseUUIDPipe()) id: string) {
        return this.publicService.getProductRelation(id);
    }

    // *--- For Categories ---* //
    @Get("/categories")
    @ApiResponse({ status: 200, type: [GetCategoriesDTO] })
    public getCategories() {
        return this.publicService.getCategories();
    }

    // *--- For Main View Info ---* //
    @Get("/main")
    public getMainView() {
        return this.publicService.getMainViewInfo();
    }

    // *--- For Get Provinces And Municipalitys ---* //
    @Get("/provinces")
    public getProvinces() {
        return this.publicService.getProvinces();
    }

    // *--- For Get Municipalitys By A Province ---* //
    @Get("/municipalities/:id")
    public getMunicipalities(@Param("id", new ParseUUIDPipe()) id: string) {
        return this.publicService.getMunicipalities(id);
    }

    // *--- For Get Municipality info ---* //
    @Get("/municipality/:id")
    public getMunicipality(@Param("id", new ParseUUIDPipe()) id: string) {
        return this.publicService.getMunicipality(id);
    }

    // *--- Get Prices of Municipality ---* //
    @Post("/shipping-price")
    public getShippingPrice(@Body() body: ShippingDTO) {
        return this.publicService.getShippingPrice(body);
    }
}
