import {
    UseGuards,
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete, ParseUUIDPipe, Query, Req
} from "@nestjs/common";
import {
    ApiTags,
    ApiBearerAuth
} from "@nestjs/swagger";
import { roles } from 'src/subsystems/roles/enum/roles.enum';
import { Roles } from 'src/subsystems/roles/decorators/roles.decorator';
import { LocalAuthGuard } from 'src/subsystems/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/subsystems/auth/guards/roles.guard';
import { OrderService } from '../services/orders.service';
import { OrderEntity } from '../entities/order.entity';
import { updateOrderDTO } from '../dto/updateOrderDTO.dto';
import { IPagination } from "../../../common/interfaces/pagination.interface";


@ApiTags('orders')
@ApiBearerAuth()
@Controller('orders')
@UseGuards(LocalAuthGuard,RolesGuard)
export class OrderControllers {
    constructor(private readonly orderService: OrderService) { }
    
    @Get()
    @Roles(roles.Admin)
    async getallorders_prodcts(@Query() pagination?: IPagination): Promise<OrderEntity[]> {
        return  this.orderService.findAll(pagination)
    }

    @Post('process_order')
    @Roles(roles.Admin)
    async process_order(@Body('order') order: string){
        return this.orderService.processOrders(order);
    }

    @Get(':id')
    @Roles(roles.Admin)
    getOrderById(@Param('id', new ParseUUIDPipe()) id: string): Promise<OrderEntity> {
        return this.orderService.findOneById(id);
    }

    @Patch(':id')
    @Roles(roles.Admin)
    updateOrder(@Param('id', new ParseUUIDPipe()) id: string, @Body() updateorder:updateOrderDTO): Promise<Partial<OrderEntity>> {
        return this.orderService.update(id, updateorder);
    }

    @Delete(':id')
    @Roles(roles.Admin)
    deleteOrder(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
        return this.orderService.softDelete(id);
    }

    @Get('ci/:ci')
    @Roles(roles.Admin, roles.Delivering)
    async getOrdersByCi(@Param('ci') ci: string): Promise<OrderEntity[]> {
        return await this.orderService.findOrdersByCi(ci);
    }

    @Post('complete-order/:id')
    @Roles(roles.Delivering, roles.Admin)
    async completeOrder(@Param('id', new ParseUUIDPipe()) id: string, @Req() req: any): Promise<{message: string}> {
        return await this.orderService.completeOrder(id, req.user.id);
    }
}