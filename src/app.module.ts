import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostgresDataSource } from 'typeorm.config';
import { AuthModule } from './subsystems/auth/auth.module';
import { OrdersModule } from './subsystems/orders/orders.module';
import { ProductsModule } from './subsystems/products/products.module';
import { CommonModule } from './common/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './subsystems/user/user.module';
import { CartModule } from './subsystems/cart/cart.module';
import { RolesModule } from './subsystems/roles/roles.module';
import { PublicModule } from './subsystems/public/public.module';
import { PaymentsModule } from './subsystems/payments/payments.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(PostgresDataSource.options),
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    OrdersModule,
    ProductsModule,
    CommonModule,
    CartModule,    
    AuthModule,
   RolesModule,
   PublicModule,
   PaymentsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
