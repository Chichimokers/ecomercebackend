import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscountEntity } from "./entity/discounts.entity";
//import { OfferEntity } from "./entity/offers.entity";
//import { OffersController } from "./controller/offers.controller";
//import { OffersService } from "./service/offers.service";
import { DiscountsController } from "./controller/discounts.controller";
import { ProductService } from "../products/services/product.service";
import { Repository } from "typeorm";
import { ProductEntity } from "../products/entity/product.entity";
import { DiscountsService } from "./service/discounts.service";
import { CategoryEntity, SubCategoryEntity } from '../category/entity/category.entity';

@Module({
    imports:[
        TypeOrmModule.forFeature([DiscountEntity, ProductEntity, CategoryEntity, SubCategoryEntity]),
        ConfigModule.forRoot({ isGlobal: true }),
    ],
    controllers: [DiscountsController],
    providers: [ProductService, DiscountsService, Repository],
})
export class DiscountsModule {}
