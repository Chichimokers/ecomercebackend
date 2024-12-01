import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscountEntity, OfferEntity } from "./entity/discounts.entity";

@Module({
    imports:[
        TypeOrmModule.forFeature([OfferEntity, DiscountEntity]),
        ConfigModule.forRoot({ isGlobal: true }),
    ],
})
export class DiscountsModule {}
