// Import Line
import { Req, UseGuards, Controller, Get, Post, BadRequestException} from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiBody, ApiResponse } from "@nestjs/swagger";
import { LocalAuthGuard } from "src/subsystems/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/subsystems/auth/guards/roles.guard";
import { Roles } from "src/subsystems/roles/decorators/roles.decorator";
import { roles } from "src/subsystems/roles/enum/roles.enum";
import { OrderService } from "src/subsystems/orders/services/orders.service";
import { isValidCi } from "src/common/utils/validate-ci.utils";
import { CreateOrderDTO } from "src/subsystems/orders/dto/CreateOrderDTO";

// Controller
@ApiTags('public')
@ApiBearerAuth()
@Controller('public')
@UseGuards(LocalAuthGuard,RolesGuard)

export class PublicController {
    constructor (private readonly orderService: OrderService) { }

    // Get User Order History
    // TODO pending to review
    @Get('/orders')
    @Roles(roles.User)
    public getOrders(@Req() request) {
        return this.orderService.getHistory(request.user.id);
    }

    // Create Order
    // TODO pending to review
    @Post('/createorder')
    @Roles(roles.User)
    @ApiBody({ type: CreateOrderDTO })
    public async createOrder(@Req() request) {
        // Get the info of the order
        const userId = request.user.id;
        const phone = request.body.phone;
        const address = request.body.address;
        const CI = request.body.CI;
    
        // Create the order
        if (!isValidCi(CI)) {
            return { "statusCode": 400, "message": "Ci is not valid" };
        }
        const orden = await this.orderService.createOrder(userId, phone, address, CI);
        
        // Verificar si orden es un objeto de error
        if (typeof orden === 'object') {
            return { statusCode: 200, message: "El usuario no tiene productos en el carrito." }; // Mensaje personalizado
        }
    
        return orden;
    }

    // Products!
    @Get('/products')
    @Roles(roles.User)
    public getProducts() {
        
    }
}