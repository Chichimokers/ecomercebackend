import { Module } from "@nestjs/common";
import { MailsService } from "./services/mails.service";
import { MailerModule } from "@nestjs-modules/mailer";

@Module({
    imports: [
        MailerModule.forRoot({
          transport: {
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // true para SSL/TLS
            auth: {
              user: 'tu-correo@gmail.com', // Tu correo
              pass: 'contraseña-de-aplicación', // Contraseña de aplicación
            },
          },
          defaults: {
            from: '"Tu Nombre" <tu-correo@gmail.com>', // Remitente por defecto
          },
        }),
      ],
})
export class MailsModule {}