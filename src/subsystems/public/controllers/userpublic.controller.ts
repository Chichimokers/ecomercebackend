import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BuildOrderDTO } from '../dto/frontsDTO/ordersDTO/buildorder.dto';
import { OrderService } from '../../orders/services/orders.service';
import { Roles } from '../../roles/decorators/roles.decorator';
import { roles } from '../../roles/enum/roles.enum';
import { LocalAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { DeleteOrderDTO } from '../dto/frontsDTO/ordersDTO/deleteorder.dto';

@ApiTags('userpublic')
@ApiBearerAuth()
@Controller('userpublic')
@UseGuards(LocalAuthGuard, RolesGuard)
export class UserPublicController {
    constructor(private orderService: OrderService) { }

    @Post('/create-order')
    @Roles(roles.User)
    createOrder(@Req() request: any, @Body() orderdto: BuildOrderDTO) {
        const userid = request.user.Id;
        return this.orderService.createOrderService(userid, orderdto);
    }

    @Post('/cancel-order')
    @Roles(roles.User)
    cancelOrder(@Req() request: any, @Body() orderdto: DeleteOrderDTO) {
        const userid = request.user.Id;
        return this.orderService.cancelOrderByUser(userid, orderdto.orderId);
    }

    // *--- For Order View ---* //
    @Get('/orders')
    @Roles(roles.User)
    public getUserOrder(@Req() request: any) {
        const userid = request.user.Id;
        return this.orderService.getOrderByUser(userid);
    }
}
