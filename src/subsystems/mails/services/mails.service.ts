import { Inject, Injectable } from "@nestjs/common";
import { OrderEntity } from 'src/subsystems/orders/entities/order.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { UserService } from "../../user/service/user.service";
import { User } from "src/subsystems/user/entities/user.entity";

@Injectable()
export class MailsService {
    constructor(
        public mailservice: MailerService,
        /*@InjectRepository(OrderEntity)
        private readonly orderRepository: Repository<OrderEntity>,*/
        @Inject(UserService)
        private readonly userService: UserService,
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

    public async sendOrderConfirmationEmail(order: OrderEntity) {
        try {
            await this.mailservice.sendMail({
                to: order.user.email,
                from: '"Esaki-Shop" <developer1575@gmail.com>',
                subject: `Confirmación de Pedido #${order.id}`,
                template: 'order', // Nombre del archivo template (debería coincidir con tu HTML)
                context: {
                    nombreCliente: order.user.name, // Ajusta según tu estructura
                    numeroPedido: order.id,
                    productos: order.orderItems.map(item => ({
                        nombre: item.product.name,
                        cantidad: item.quantity,
                        precio: item.product.price,
                        subtotal: (item.product.price * item.quantity)
                    })),
                    total: order.subtotal,
                    direccionEnvio: order.address,
                    metodoPago: order.address
                }
            });
            console.log(`Order confirmation sent to ${ order.user.email}`);
            return true;
        } catch (error) {
            console.error('Error sending order confirmation:', error);
            return false;
        }
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

    // *--- For Notifications Admins ---* //

    public async sendNotificationEmails(orderCounts: number): Promise<void> {
        const admins: User[] = await this.userService.getAdminsEmails();

        if (!admins || admins.length === 0) {
            return;
        }

        const failedEmails = [];

        const subject = `Notificación: ${orderCounts} órdenes pendientes de atención`;
        const template = `
            <h2>Notificación automática del sistema</h2>
            <p>Hay <strong>${orderCounts}</strong> órdenes con estado PAGADO pendientes de atender.</p>
            <p>Por favor, procese estas órdenes lo antes posible.</p>
        `;

        for (const admin of admins) {
            try {
                await this.mailservice.sendMail({
                    to: admin.email,
                    subject: subject,
                    html: template,
                });
            } catch (error) {
                failedEmails.push({ email: admin.email, error: error.message });
            }
        }

        // Reintentar enviar a los correos que fallaron
        if (failedEmails.length > 0) {
            await this.retryFailedEmails(failedEmails, subject, template);
        }
    }

    private async retryFailedEmails(failedEmails, subject: string, template: string): Promise<void> {
        for (const item of failedEmails) {
            try {
                await this.mailservice.sendMail({
                    to: item.email,
                    subject: `${subject}`,
                    html: template,
                });
            } catch (error) {
                // Aquí podrías implementar un sistema de alertas para administradores
                // o guardar en base de datos para futuros reintentos
            }
        }
    }
}
