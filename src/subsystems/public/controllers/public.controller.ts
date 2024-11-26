// Import Line
import { Req, UseGuards, Controller, Get, Post, Query, BadRequestException} from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiBody, ApiQuery, ApiResponse } from "@nestjs/swagger";
import { LocalAuthGuard } from "src/subsystems/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/subsystems/auth/guards/roles.guard";
import { Roles } from "src/subsystems/roles/decorators/roles.decorator";
import { roles } from "src/subsystems/roles/enum/roles.enum";
import { OrderService } from "src/subsystems/orders/services/orders.service";
import { isValidCi } from "src/common/utils/validate-ci.utils";
import { CreateOrderDTO } from "src/subsystems/orders/dto/CreateOrderDTO";
import { PublicService } from "../services/public.service";
import { GetOrderDTO } from "../dto/GetOrderDTO";
import { GetProductDTO } from "../dto/GetProductsDTO";

// Controller
@ApiTags('public')
@ApiBearerAuth()
@Controller('public')
@UseGuards(LocalAuthGuard, RolesGuard)
export class PublicController {
    constructor(
        private readonly orderService: OrderService,
        private readonly publicService: PublicService,
    ) {}

    // Get User Order History
    // TODO pending to review
    @Get('/orders')
    @Roles(roles.User)
    @ApiResponse({
        status: 200,
        description: "User's personal orders.",
        type: [GetOrderDTO],
    })
    public getOrders(@Req() request) {
        return this.publicService.getPublicOrders(request.user.Id);
    }

    // Create Order
    // TODO pending to review
    @Post('/createorder')
    @Roles(roles.User)
    @ApiBody({ type: CreateOrderDTO })
    public async createOrder(@Req() request) {
        // Get the info of the order
        const userId = request.user.Id;
        const phone = request.body.phone;
        const address = request.body.address;
        const CI = request.body.CI;

        // Create the order
        if (!isValidCi(CI)) {
            throw new BadRequestException('Ci is not valid');
        }

        const orden: any = await this.orderService.createOrder(
            userId,
            phone,
            address,
            CI,
        );

        if (orden == null) {
            throw new BadRequestException(
                'El usuario no tiene productos en el carrito.',
            ); // Mensaje personalizado
        }

        return orden;
    }

    // Products!
    @Get('/products')
    @Roles(roles.User)
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiResponse({ type: [GetProductDTO] })
    public getProducts(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ) {
        page = Number(page);
        return this.publicService.getProducts(page, limit);
    }

    // Get Product by Name
    @Get('/products_search')
    @Roles(roles.User)
    @ApiQuery({ name: 'search', required: false, type: String })
    public getProductByName(@Query('search') search: string) {
        return this.publicService.getProductByName(search);
    }

    // Get Info of a Product
    @Get('/product_info')
    @Roles(roles.User)
    @ApiQuery({ name: 'id', required: true, type: Number })
    public getProductInfo(@Query('id') id: number) {
        return this.publicService.getProductInfo(id);
    }
}