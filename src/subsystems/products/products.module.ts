import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entity/product.entity';
import { ProductService } from './services/product.service';
import { ProductControllers } from './controllers/product.controller';

@Module({
    imports:[
        TypeOrmModule.forFeature([ProductEntity]),
        ConfigModule.forRoot({ isGlobal: true }),
    ],
        controllers:[ProductControllers],
        providers:[ProductService],
        exports:[ProductService]
})
export class ProductsModule {}
