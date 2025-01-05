import {
    BadRequestException,
    Body,
    Controller,
    Get,
    ParseArrayPipe,
    Query,

} from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PublicService } from '../services/public.service';
import { ProductsViewDTO } from '../dto/frontsDTO/views/productsView.dto';
import { HomeViewDTO } from '../dto/frontsDTO/views/homeView.dto';
import { ProductDTO } from "../dto/frontsDTO/productsDTO/getproducts.dto";
import { GetCategoriesDTO } from "../dto/frontsDTO/categoryDTO/getCategories.dto";

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
    @Get('/search')
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
    public getProductView(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query(
            'category',
            new ParseArrayPipe({
                items: Number,
                separator: ',',
                optional: true,
            }),
        )
        categoryIds?: number[],
        @Query(
            'subcategory',
            new ParseArrayPipe({
                items: Number,
                separator: ',',
                optional: true,
            }),
        )
        subCategoryIds?: number[],
        @Query(
            'pricerange',
            new ParseArrayPipe({
                items: Number,
                separator: '-',
                optional: true,
            }),
        )
        prices?: number[],
        @Query('rate')
        rate?: number,
    ) {
        try {
            page = Number(page);
        } catch (error) {
            throw new BadRequestException('Invalid page format');
        }

        try {
            limit = Number(limit);
        } catch (error) {
            throw new BadRequestException('Invalid limit format');
        }

        try {
            rate = Number(rate);
        } catch (error) {
            throw new BadRequestException('Invalid rate format');
        }

        if (categoryIds && categoryIds.length === 0) {
            throw new BadRequestException('categoryIds must not be empty');
        }

        if (subCategoryIds && subCategoryIds.length === 0) {
            throw new BadRequestException('subCategoryIds must not be empty');
        }

        if (prices && prices.length === 0) {
            throw new BadRequestException('prices must not be empty');
        }

        const filters = {
            categoryIds,
            subCategoryIds,
            prices,
            rate,
        };

        return this.publicService.getProductsPage(page, limit, filters);
    }

    // *--- For Products Details View ---* //
    // TODO Need tests
    @Get('/product-details')
    @ApiResponse({ status: 200, type: [ProductDTO] })
    @ApiResponse({ status: 400, description: 'Missing id' })
    public getProductDetails(@Body('id') id: number) {
        return this.publicService.getProductDetails(id);
    }

    // *--- For Categories ---* //
    @Get('/categories')
    @ApiResponse({ status: 200, type: [GetCategoriesDTO] })
    public getCategories() {
        return this.publicService.getCategories();
    }
}
