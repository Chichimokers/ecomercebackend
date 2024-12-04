import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { PublicService } from "./services/public.service";
import { PublicController } from "./controllers/public.controller";
import { OrderService } from "../orders/services/orders.service";
import { OrderEntity } from "../orders/entities/order.entity";
import { OrderProductEntity } from "../orders/entities/order_products.entity";
import { ProductEntity } from "../products/entity/product.entity";
import { UserService } from "../user/service/user.service";
import { User } from "../user/entities/user.entity";


@Module({
    imports:[
        TypeOrmModule.forFeature([OrderEntity, OrderProductEntity, ProductEntity, User]),
        ConfigModule.forRoot({ isGlobal: true }),
    ],
    providers: [PublicService, OrderService, UserService],
    controllers: [PublicController],
})
export class PublicModule {}