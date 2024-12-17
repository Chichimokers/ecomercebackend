import { Body, Controller, Get, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { BuildOrderDTO } from '../dto/frontsDTO/ordersDTO/buildorder.dto';
import { OrderService } from '../../orders/services/orders.service';
import { PublicService } from "../services/public.service";
import { ProductsViewDTO } from "../dto/frontsDTO/views/productsView.dto";
import { Roles } from "../../roles/decorators/roles.decorator";
import { roles } from "../../roles/enum/roles.enum";
import { LocalAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../auth/guards/roles.guard";
import { HomeViewDTO } from "../dto/frontsDTO/views/homeView.dto";


@ApiTags('public')
@ApiBearerAuth()
@Controller('public')
//@UseGuards(LocalAuthGuard, RolesGuard)
export class PublicController {
    constructor(private orderService: OrderService,
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
    @ApiResponse({ status: 200, type: HomeViewDTO })
    public getHomeView() {
        return this.publicService.getHomeView();
    }

    // *--- For Products View ---* //
    @Get('/products')
    //@Roles(roles.User)
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiResponse({ status: 200 ,type: ProductsViewDTO })
    public getProductView (
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ) {
        page = Number(page);
        limit = Number(limit);

        return this.publicService.getProductsPage(page, limit);
    }
}