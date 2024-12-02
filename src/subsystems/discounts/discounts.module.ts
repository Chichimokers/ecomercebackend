import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscountEntity } from "./entity/discounts.entity";
import { OfferEntity } from "./entity/offers.entity";
import { OffersController } from "./controller/offers.controller";
import { DiscountsController } from "./controller/discounts.controller";
import { OffersService } from "./service/offers.service";
import { ProductService } from "../products/services/product.service";
import { Repository } from "typeorm";
import { ProductEntity } from "../products/entity/product.entity";

@Module({
    imports:[
        TypeOrmModule.forFeature([OfferEntity, DiscountEntity, ProductEntity]),
        ConfigModule.forRoot({ isGlobal: true }),
    ],
    controllers: [OffersController, DiscountsController],
    providers: [OffersService, ProductService, Repository],
})
export class DiscountsModule {}
