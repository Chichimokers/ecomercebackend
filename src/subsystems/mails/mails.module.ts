import { Module } from '@nestjs/common';
import { MailsService } from './services/mails.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { join } from 'path';
import { UserService } from "../user/service/user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrderEntity } from "../orders/entities/order.entity";
import { OrderProductEntity } from "../orders/entities/order_products.entity";
import { ProductEntity } from "../products/entity/product.entity";
import { CategoryEntity, SubCategoryEntity } from "../category/entity/category.entity";
import { DiscountEntity } from "../discounts/entity/discounts.entity";
import { ProvinceEntity } from "../locations/entity/province.entity";
import { MunicipalityEntity } from "../locations/entity/municipality.entity";
import { PriceByWeightEntity } from "../locations/entity/priceByWeight.entity";
import { User } from "../user/entities/user.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            User,
        ]),
        MailerModule.forRoot({
            transport: {
                host: 'smtp.gmail.com',
                port: 465,
                secure: true, // true para SSL/TLS
                auth: {
                    user: process.env.GOOGLE_MAIL || 'developer1575@gmail.com', // Tu correo
                    pass:  process.env.GOOGLE_PASS || 'nfuv gdlp paja jzpo', // Contraseña de aplicación
                },
            },
            defaults: {
                from: '"Esaki-Shop" <developer1575@gmail.com>', // Remitente por defecto
            },
            template: {
                dir: join(__dirname , 'templates/mails'),
                adapter: new HandlebarsAdapter(),
                options: {
                    strict: true,
                },
            },
        }),
    ],
    providers: [MailsService, UserService],
})
export class MailsModule {}
