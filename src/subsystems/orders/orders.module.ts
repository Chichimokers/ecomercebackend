import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports:[
        TypeOrmModule.forFeature([OrderEntity]),    
        ConfigModule.forRoot({ isGlobal: true }),
    ]
})
export class OrdersModule {}
