import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BuildOrderDTO } from '../dto/frontsDTO/ordersDTO/buildorder.dto';
import { OrderService } from '../../orders/services/orders.service';
import { Roles } from '../../roles/decorators/roles.decorator';
import { roles } from '../../roles/enum/roles.enum';
import { LocalAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { DeleteOrderDTO } from '../dto/frontsDTO/ordersDTO/deleteorder.dto';
import { PaypalService } from 'src/subsystems/payments/service/paypal.service';
import { OrderEntity } from 'src/subsystems/orders/entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@ApiTags('userpublic')
@ApiBearerAuth()
@Controller('userpublic')
@UseGuards(LocalAuthGuard, RolesGuard)
export class UserPublicController {
    constructor(private orderService: OrderService,private paypalservice :PaypalService,
     @InjectRepository(OrderEntity)
    private orderRepository : Repository<OrderEntity>) { }

    @Post('/create-order')
    @Roles(roles.User)
    createOrder(@Req() request: any, @Body() orderdto: BuildOrderDTO) {
        const userid = request.user.Id;
        return this.orderService.createOrderService(userid, orderdto);
    }  

    @Post('/calcular_envio')
    @Roles(roles.User)
    async  calcenvio(@Req() request: any,@Body() boduy : any) {
        
        const userid = request.user.Id;
        const orderbd: OrderEntity = await this.orderRepository.findOne({
            where: { id: boduy.orderid },
            relations: [
                'orderItems',
                'orderItem.product',
                'orderItem.product.discounts',
                'municipality', // Relación directa de OrderEntity -> MunicipalityEntity
                'municipality.prices', // Relación MunicipalityEntity -> PriceByWeightEntity
            ],
        });

        return this.paypalservice.calcularprecio_envio(orderbd)
    }

    @Post('/retire-order')
    @Roles(roles.User)
    retireOrder(@Req() request: any, @Body() orderdto: DeleteOrderDTO) {
        const userid = request.user.Id;
        return this.orderService.retireOrderByUser(userid, orderdto.orderId);
    }

    // *--- For Order View ---* //
    @Get('/orders')
    @Roles(roles.User)
    public getUserOrder(@Req() request: any) {
        const userid = request.user.Id;
        return this.orderService.getOrderByUser(userid);
    }
}
