import { LocalAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../auth/guards/roles.guard";
import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { BuildOrderDTO } from "../dto/frontsDTO/ordersDTO/buildorder.dto";
import { OrderService } from "../../orders/services/orders.service";

@ApiTags('public')
@ApiBearerAuth()
@Controller('public')
@UseGuards(LocalAuthGuard, RolesGuard)
export class PublicController{
    constructor(private orderService: OrderService) {
    }

    @Post()
    createOrder(@Req() request: any, @Body() orderdto: BuildOrderDTO){
        const userid = request.user.Id;
        console.log(userid);
        console.log(orderdto);
        return this.orderService.createOrderService(userid, orderdto);
    }
}