import { Injectable } from '@nestjs/common';
import { OrderEntity } from 'src/subsystems/orders/entities/order.entity';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailsService {
    constructor(
        public mailservice: MailerService,
        /*@InjectRepository(OrderEntity)
        private readonly orderRepository: Repository<OrderEntity>,*/
    ) {}

    public async sendOrderAcceptedMail(order: OrderEntity, email: string) {
        await this.mailservice.sendMail({
            to: email,
            subject: 'Tu orden ha sido aceptada. GRACIAS POR COMPRAR!',
            // TODO Investigar y sacar alguna idea para esto.
        })
    }

    public async sendOrderMail(order: OrderEntity, email: string) {
        await this.mailservice.sendMail({
            to: email,
        });
    }

    public async sendVerificationEmail(to: string, verificationCode: string) {
        try {
            console.log(verificationCode);
            await this.mailservice.sendMail({
                to: to, // Dirección de correo del destinatario
                from: '"Esaki-Shop" <developer1575@gmail.com>', // Remitente
                subject: 'Verify Your Email', // Asunto del correo
                //text: `Your verification code is: ${verificationCode}`, // Cuerpo del correo
                template: 'code',
                context: { verificationCode: verificationCode },
            });
            console.log('Verification email sent successfully');
            return true;
        } catch (error) {
            console.error('Error sending verification email:', error);
            return false;
        }
    }
}
