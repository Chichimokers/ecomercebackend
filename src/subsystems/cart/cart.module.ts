import { Module } from '@nestjs/common';
import { CartEntity } from './entity/cart.entity';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartService } from './services/cart.service';
import { CartController } from './controllers/cart.controller';
import { ProductService } from '../products/services/product.service';
import { ProductEntity } from '../products/entity/product.entity';
import { UserService } from '../user/service/user.service';
import { User } from '../user/entities/user.entity';


@Module({

imports:[

        TypeOrmModule.forFeature([CartEntity,ProductEntity,User]),    
        ConfigModule.forRoot({ isGlobal: true }),
],
controllers:[CartController],
providers:[CartService,ProductService,UserService]

})
export class CartModule {}
