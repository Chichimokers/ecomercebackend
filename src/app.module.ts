import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostgresDataSource } from 'typeorm.config';
import { AuthModule } from './subsystems/auth/auth.module';
import { OrdersModule } from './subsystems/orders/orders.module';
import { ProductsModule } from './subsystems/products/products.module';
import { CommonModule } from './common/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot(PostgresDataSource.options),
    AuthModule,
    OrdersModule,
    ProductsModule,
    CommonModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
