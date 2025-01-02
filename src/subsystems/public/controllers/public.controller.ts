import {
    BadRequestException,
    Body,
    Controller,
    Get,
    ParseArrayPipe,
    Post,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BuildOrderDTO } from '../dto/frontsDTO/ordersDTO/buildorder.dto';
import { OrderService } from '../../orders/services/orders.service';
import { PublicService } from '../services/public.service';
import { ProductsViewDTO } from '../dto/frontsDTO/views/productsView.dto';
import { Roles } from '../../roles/decorators/roles.decorator';
import { roles } from '../../roles/enum/roles.enum';
import { LocalAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { HomeViewDTO } from '../dto/frontsDTO/views/homeView.dto';
import { ProductDTO } from "../dto/frontsDTO/productsDTO/getproducts.dto";

@ApiTags('public')
@ApiBearerAuth()
@Controller('public')
@UseGuards(LocalAuthGuard, RolesGuard)
export class PublicController {
    constructor(
        private orderService: OrderService,
        private publicService: PublicService,
    ) {}

    @Post('create-order')
    @Roles(roles.User)
    createOrder(@Req() request: any, @Body() orderdto: BuildOrderDTO) {
        const userid = request.user.Id;
        return this.orderService.createOrderService(userid, orderdto);
    }

    // *--- For Home View ---* //
    @Get('/home')
    //@Roles(roles.User)
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiResponse({ status: 200, type: HomeViewDTO })
    public getHomeView(@Query('limit') limit: number = 20) {
        limit = Number(limit)
        return this.publicService.getHomeView(limit);
    }

    // *--- For Home View ---* //
    @Get('/search')
    //@Roles(roles.User)
    //FIXME No aceptar entradas vacias!
    public searchProduct(@Body('name') name: string) {
        return this.publicService.getProductByName(name);
    }

    // *--- For Products View ---* //
    @Get('/products')
    //@Roles(roles.User)
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
        page = Number(page);
        limit = Number(limit);
        rate = Number(rate);

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
    //@Roles(roles.User)
    @ApiResponse({ status: 200, type: [ProductDTO] })
    @ApiResponse({ status: 400, description: 'Missing id' })
    public getProductDetails(@Body('id') id: number) {
        return this.publicService.getProductDetails(id);
    }

    // *--- For Order View ---* //
    @Get('/orders')
    @Roles(roles.User)
    public getUserOrder(@Req() request: any) {
        const userid = request.user.Id;
        return this.orderService.getOrderByUser(userid);
    }

}
