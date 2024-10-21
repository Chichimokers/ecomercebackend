import { Module } from '@nestjs/common';
import { CartEntity } from './entity/cart.entity';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
providers:[],
imports:[

        TypeOrmModule.forFeature([CartEntity]),
    
        ConfigModule.forRoot({ isGlobal: true }),
],


})
export class CartModule {}
