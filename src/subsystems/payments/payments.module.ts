import { Module } from '@nestjs/common';
import { PaypalService } from './service/paypal.service';
import { PaypalController } from './controller/paypal.controller';
import { OrderService } from '../orders/services/orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartEntity } from '../cart/entity/cart.entity';
import { OrderEntity } from '../orders/entities/order.entity';
import { UserService } from '../user/service/user.service';
import { User } from '../user/entities/user.entity';
import { StripeController } from "./controller/stripe.controller";
import { StripeService } from "./service/stripe.service";
import { Repository } from "typeorm";

@Module({
    imports: [TypeOrmModule.forFeature([CartEntity,OrderEntity,User])],
    providers:[PaypalService, StripeService, OrderService, UserService, Repository],
    controllers:[PaypalController, StripeController]
})
export class PaymentsModule {}
