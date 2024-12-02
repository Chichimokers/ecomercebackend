import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscountEntity } from "./entity/discounts.entity";
import { OfferEntity } from "./entity/offers.entity";
import { OffersController } from "./controller/offers.controller";
import { DiscountsController } from "./controller/discounts.controller";

@Module({
    imports:[
        TypeOrmModule.forFeature([OfferEntity, DiscountEntity]),
        ConfigModule.forRoot({ isGlobal: true }),
    ],
    controllers: [OffersController, DiscountsController],
})
export class DiscountsModule {}
