import { Module } from '@nestjs/common';
import { PaypalService } from './service/paypal.service';
import { PaypalController } from './controller/paypal.controller';
import { OrderService } from '../orders/services/orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from '../orders/entities/order.entity';
import { UserService } from '../user/service/user.service';
import { User } from '../user/entities/user.entity';
import { StripeController } from "./controller/stripe.controller";
import { StripeService } from "./service/stripe.service";
import { Repository } from "typeorm";
import { ProductEntity } from "../products/entity/product.entity";
import { OrderProductEntity } from "../orders/entities/order_products.entity";
import { MunicipalityEntity } from "../locations/entity/municipality.entity";
import { MailsService } from '../mails/services/mails.service';

@Module({
    imports: [TypeOrmModule.forFeature([OrderEntity, ProductEntity, OrderProductEntity,User, MunicipalityEntity])],
    providers:[PaypalService, StripeService, OrderService, UserService, Repository,MailsService],
    controllers:[PaypalController, StripeController]
})
export class PaymentsModule {}
