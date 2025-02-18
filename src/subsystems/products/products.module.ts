import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entity/product.entity';
import { ProductService } from './services/product.service';
import { ProductControllers } from './controllers/product.controller';
import {
    CategoryEntity,
    SubCategoryEntity,
} from '../category/entity/category.entity';
import { DiscountEntity } from '../discounts/entity/discounts.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ProductEntity,
            CategoryEntity,
            SubCategoryEntity,
            DiscountEntity,
        ]),
        ConfigModule.forRoot({ isGlobal: true }),
    ],
    controllers: [ProductControllers],
    providers: [ProductService],
    exports: [ProductService],
})
export class ProductsModule {}
