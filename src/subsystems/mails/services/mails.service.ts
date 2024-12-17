import { Injectable } from '@nestjs/common';
import { OrderEntity } from 'src/subsystems/orders/entities/order.entity';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailsService {
    constructor(public mailservice: MailerService) {}

    public sendOrderMail(order: OrderEntity, email: string) {
        this.mailservice.sendMail({
            to: email,
        });
    }

    public async sendVerificationEmail(to: string, verificationCode: string) {
        try {
            await this.mailservice.sendMail({
                to: to, // Dirección de correo del destinatario
                from: '"Esaki-Shop" <developer1575@gmail.com>', // Remitente
                subject: 'Verify Your Email', // Asunto del correo
                text: `Your verification code is: ${verificationCode}`, // Cuerpo del correo
            });
            console.log('Verification email sent successfully');
        } catch (error) {
            console.error('Error sending verification email:', error);
        }
    }
}
