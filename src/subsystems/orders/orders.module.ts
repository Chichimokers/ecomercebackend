import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrderEntity } from "./entities/order.entity";
import { ConfigModule } from "@nestjs/config";
import { OrderControllers } from "./controllers/orders.controller";
import { OrderService } from "./services/orders.service";
import { UserService } from "../user/service/user.service";
import { User } from "../user/entities/user.entity";
import { ProductEntity } from "../products/entity/product.entity";
import { OrderProductEntity } from "./entities/order_products.entity";
import { MunicipalityEntity } from "../locations/entity/municipality.entity";

import { MailsService } from "../mails/services/mails.service";
import { OrderAdminSchedule } from "./schedule/orderadmin.schedule";
import { MunicipalityService } from "../locations/service/municipality.service";
import { ProvinceEntity } from "../locations/entity/province.entity";
import { PriceByWeightEntity } from "../locations/entity/priceByWeight.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([OrderEntity, OrderProductEntity, ProductEntity, ProvinceEntity, PriceByWeightEntity, MunicipalityEntity, User]),
        ConfigModule.forRoot({ isGlobal: true })

    ],
    providers: [OrderService, MailsService, UserService, MunicipalityService, OrderAdminSchedule],
    controllers: [OrderControllers]

})
export class OrdersModule {
}
