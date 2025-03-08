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
import { CategoryEntity, SubCategoryEntity } from '../category/entity/category.entity';
import { CategoryService } from "../category/services/category.service";
import { ProductService } from "../products/services/product.service";
import { UserPublicController } from "./controllers/userpublic.controller";
import { DiscountEntity } from '../discounts/entity/discounts.entity';
import { CacheModule } from "@nestjs/cache-manager";
import { ProvinceService } from "../locations/service/province.service";
import { ProvinceEntity } from "../locations/entity/province.entity";
import { MunicipalityEntity } from "../locations/entity/municipality.entity";
import { MunicipalityService } from "../locations/service/municipality.service";
import { PriceByWeightEntity } from "../locations/entity/priceByWeight.entity";
import { PaypalService } from "../payments/service/paypal.service";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { PublicCacheInterceptor } from "./interceptors/cache.interceptor";

@Module({
    imports:[
        TypeOrmModule.forFeature([OrderEntity,
            OrderProductEntity,
            ProductEntity,
            CategoryEntity,
            SubCategoryEntity,
            DiscountEntity,
            ProvinceEntity,
            MunicipalityEntity,
            PriceByWeightEntity,
            User,
        ]),
        CacheModule.register({
            ttl: 86400,
            max: 5000,
        }),
        ConfigModule.forRoot({ isGlobal: true }),
    ],
    providers: [PublicService,
        PaypalService,
        OrderService,
        UserService,
        CategoryService,
        ProductService,
        ProvinceService,
        MunicipalityService,
        {
            provide: APP_INTERCEPTOR,
            useClass: PublicCacheInterceptor,
        }
    ],
    controllers: [PublicController, UserPublicController],
})
export class PublicModule {}