import { Body, Controller, Get, ParseIntPipe, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { BuildOrderDTO } from '../dto/frontsDTO/ordersDTO/buildorder.dto';
import { OrderService } from '../../orders/services/orders.service';
import { PublicService } from "../services/public.service";
import { GetProductDTO } from "../dto/frontsDTO/productsDTO/getproducts.dto";

@ApiTags('public')
@ApiBearerAuth()
@Controller('public')
//@UseGuards(LocalAuthGuard, RolesGuard)
export class PublicController {
    constructor(private orderService: OrderService,
                private publicService: PublicService,
                ) {}

    @Post('create-order')
    //@Roles(roles.User)
    createOrder(@Req() request: any, @Body() orderdto: BuildOrderDTO) {
        const userid = request.user.Id;
        return this.orderService.createOrderService(userid, orderdto);
    }

    @Get('/products')
    //@Roles(roles.User)
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiResponse({ status: 200 ,type: GetProductDTO })
    public getProducts(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ) {
        page = Number(page);
        limit = Number(limit);

        return this.publicService.getProductsPage(page, limit);
    }
}