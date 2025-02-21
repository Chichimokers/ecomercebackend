import {
    BadRequestException,
    Body,
    Controller,
    Get,
    ParseUUIDPipe,
    Post,
    Query,

} from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PublicService } from '../services/public.service';
import { ProductsViewDTO } from '../dto/frontsDTO/views/productsView.dto';
import { HomeViewDTO } from '../dto/frontsDTO/views/homeView.dto';
import { ProductDTO } from "../dto/frontsDTO/productsDTO/getproducts.dto";
import { GetCategoriesDTO } from "../dto/frontsDTO/categoryDTO/getCategories.dto";
import { ProductPublicQuery } from '../../../common/decorators/public.decorator';
import { PublicQueryInterface } from '../../../common/interfaces/basequery.interface';
import { badRequestException } from '../../../common/exceptions/modular.exception';

@ApiTags('public')
@Controller('public')
export class PublicController {
    constructor(
        private publicService: PublicService,
    ) {}

    // *--- For Home View ---* //
    @Get('/home')
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiResponse({ status: 200, type: HomeViewDTO })
    public getHomeView(@Query('limit') limit: number = 20) {
        limit = Number(limit)
        return this.publicService.getHomeView(limit);
    }

    // *--- For Home View ---* //
    @Post('/search')
    //FIXME No aceptar entradas vacias!
    public searchProduct(@Body('name') name: string) {
        return this.publicService.getProductByName(name);
    }

    // *--- For Products View ---* //
    @Get('/products')
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({
        name: 'category',
        required: false,
        isArray: true,
        type: Number,
        description: 'Category IDs separated by commas',
    })
    @ApiQuery({
        name: 'subcategory',
        required: false,
        isArray: true,
        type: Number,
        description: 'Subcategory IDs separated by commas',
    })
    @ApiQuery({
        name: 'pricerange',
        required: false,
        isArray: true,
        type: Number,
        description: 'Price range separated by hyphen',
    })
    @ApiQuery({
        name: 'rate',
        required: false,
        type: Number,
        description: 'Rate of the product',
    })
    @ApiResponse({ status: 200, type: ProductsViewDTO })
    @ApiResponse({
        status: 404,
        description: 'In case there is no product searched',
    })
    @ApiResponse({
        status: 400,
        description: 'In case you send a query without inserting valid data',
    })
    public getProductView(@ProductPublicQuery() query: PublicQueryInterface) {
        badRequestException(query.categoryIds, 'CategoryIDS');
        badRequestException(query.subCategoryIds, 'SubCategoryIDS');
        badRequestException(query.prices, 'Prices');

        const filters = {
            categoryIds: query.categoryIds,
            subCategoryIds: query.subCategoryIds,
            prices: query.prices,
            rate: query.rate,
        };

        return this.publicService.getProductsPage(
            +query.page,
            +query.limit,
            filters,
        );
    }

    // *--- For Products Details View ---* //
    @Get('/product-details')
    @ApiQuery({
        name: 'id',
        required: true,
        type: String,
        description: 'ID of the product',
    })
    @ApiResponse({ status: 200, type: ProductDTO })
    @ApiResponse({ status: 400, description: 'Missing or invalid id' })
    public getProductDetails(@Query('id', new ParseUUIDPipe()) id: string) {
        try {
            id = String(id);
        } catch (error){
            throw new BadRequestException('Incorrect ID format. Required Number')
        }

        return this.publicService.getProductDetails(id);
    }

    @Get('/product-relations')
    @ApiQuery({
        name: 'id',
        required: true,
        type: Number,
        description: 'ID of the product',
    })
    @ApiResponse({ status: 200, type: [ProductDTO] })
    @ApiResponse({ status: 400, description: 'Missing or invalid id' })
    public getProductRelation(@Query('id') id: string){
        try {
            id = String(id);
        } catch (error){
            throw new BadRequestException('Incorrect ID format. Required Number')
        }

        return this.publicService.getProductRelation(id);
    }

    // *--- For Categories ---* //
    @Get('/categories')
    @ApiResponse({ status: 200, type: [GetCategoriesDTO] })
    public getCategories() {
        return this.publicService.getCategories();
    }
}
