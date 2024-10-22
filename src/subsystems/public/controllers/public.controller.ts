// Import Line
import { Req, UseGuards, Controller, Get, Post} from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { LocalAuthGuard } from "src/subsystems/auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/subsystems/auth/guards/roles.guard";
import { Roles } from "src/subsystems/roles/decorators/roles.decorator";
import { roles } from "src/subsystems/roles/enum/roles.enum";
import { OrderService } from "src/subsystems/orders/services/orders.service";

// Controller

@ApiTags('public')
@ApiBearerAuth()
@Controller('public')
@UseGuards(LocalAuthGuard,RolesGuard)

export class PublicController {
    constructor (private readonly orderService: OrderService) { }

    // Get User Order History
    // TODO pending to review
    @Get('/orders/:id')
    @UseGuards(LocalAuthGuard)
    @Roles(roles.User)
    public getOrders(@Req() request) {
        console.log(request);
        const userId = request.user.id;
        return this.orderService.getHistory(request.user.id);
    }

    // Create Order
    // TODO pending to review
    @Post('/createorder/')
    @Roles(roles.User)
    public createOrder() {

    }
}