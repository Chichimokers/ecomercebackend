import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { ConfigModule } from '@nestjs/config';
import { OrderControllers } from './controllers/orders.controller';
import { OrderService } from './services/orders.service';
import { UserService } from '../user/service/user.service';
import { User } from '../user/entities/user.entity';
import { ProductEntity } from "../products/entity/product.entity";

@Module({
    imports:[
        TypeOrmModule.forFeature([OrderEntity,ProductEntity,User]),
        ConfigModule.forRoot({ isGlobal: true }),
    ],
    providers:[OrderService,UserService],
    controllers:[OrderControllers],
  
})
export class OrdersModule {}
