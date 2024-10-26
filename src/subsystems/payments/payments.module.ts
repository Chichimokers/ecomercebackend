import { Module } from '@nestjs/common';
import { PaypalService } from './service/paypal.service';
import { PaypalController } from './controller/paypal.controller';
import { OrderService } from '../orders/services/orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartEntity } from '../cart/entity/cart.entity';
import { OrderEntity } from '../orders/entities/order.entity';
import { UserService } from '../user/service/user.service';
import { User } from '../user/entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([CartEntity,OrderEntity,User])],
    providers:[PaypalService,OrderService,UserService],
    controllers:[PaypalController]
})
export class PaymentsModule {}
