import { Module } from "@nestjs/common";
import { MailsService } from "./services/mails.service";
import { MailerModule } from "@nestjs-modules/mailer";
import { CodeService } from "../auth/service/code.service";

@Module({
    imports: [
        MailerModule.forRoot({
          transport: {
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // true para SSL/TLS
            auth: {
              user: 'developer1575@gmail.com', // Tu correo
              pass: 'nfuv gdlp paja jzpo', // Contraseña de aplicación
            },
          },
          defaults: {
            from: '"Esaki-Shop" <developer1575@gmail.com@gmail.com>', // Remitente por defecto
          },
        }),
      ],
    providers:[MailsService]
})

export class MailsModule {}