import { Module } from '@nestjs/common';
import { MailsService } from './services/mails.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { UserService } from "../user/service/user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../user/entities/user.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
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
                dir: __dirname + '/templates/mails',
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
