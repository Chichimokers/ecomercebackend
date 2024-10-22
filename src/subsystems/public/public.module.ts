import { Module } from "@nestjs/common";
import { PublicController } from "./controllers/public.controller";
import { OrderService } from "../orders/services/orders.service";
import { OrderEntity } from "../orders/entities/order.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CartEntity } from "../cart/entity/cart.entity";
import { UserService } from "../user/service/user.service";
import { User } from "../user/entities/user.entity";

@Module({
    imports: [TypeOrmModule.forFeature([OrderEntity, CartEntity, User])],
    controllers: [PublicController],
    providers: [OrderService, UserService],
    exports: [],
})
export class PublicModule {}