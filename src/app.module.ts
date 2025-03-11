import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
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
import { RolesModule } from './subsystems/roles/roles.module';
import { PublicModule } from './subsystems/public/public.module';
import { PaymentsModule } from './subsystems/payments/payments.module';
import { DiscountsModule } from "./subsystems/discounts/discounts.module";
import { RatingModule } from './subsystems/rating/rating.module';
import { CategoryModule } from './subsystems/category/category.module';
import { MailsModule } from "./subsystems/mails/mails.module";
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { LocationsModule } from './subsystems/locations/locations.module';
import { MemoryUsageMiddleware } from "./middleware/memory.middleware";
import { LoggingMiddleware } from "./middleware/endpoints.middleware";
import { AdminModule } from "./subsystems/admin/admin.module";

@Module({
    imports: [
        TypeOrmModule.forRoot(PostgresDataSource.options),
        ConfigModule.forRoot({ isGlobal: true }),
        UserModule,
        OrdersModule,
        ProductsModule,
        CommonModule,
        AuthModule,
        RolesModule,
        PublicModule,
        PaymentsModule,
        DiscountsModule,
        RatingModule,
        CategoryModule,
        LocationsModule,
        MailsModule,
        AdminModule,
        ServeStaticModule.forRoot({
            rootPath: join('./public'),
            serveStaticOptions: {
                fallthrough: false,
            }// Ruta al directorio estático
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule implements NestModule{
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggingMiddleware).forRoutes('*'); // Se aplica a todas las rutas
    }
}
