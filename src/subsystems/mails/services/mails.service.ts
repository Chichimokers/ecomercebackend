import { Inject, Injectable } from "@nestjs/common";
import { OrderEntity } from 'src/subsystems/orders/entities/order.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { UserService } from "../../user/service/user.service";
import { User } from "src/subsystems/user/entities/user.entity";

@Injectable()
export class MailsService {
    constructor(
        public mailservice: MailerService,
        @Inject(UserService)
        private readonly userService: UserService,
    ) { } j0

    public async sendOrderConfirmationEmail(order: OrderEntity) {
        try {
            // Verificar datos críticos antes de enviar
            if (!order?.user?.email) {
                console.error('Error: No se puede enviar el correo. Email de usuario no disponible', order);
                return false;
            }

            console.log('Intentando enviar email a:', order.user.email);
            // TODO MANAGE DISCOUNTS!
            const mailResult = await this.mailservice.sendMail({
                to: order.user.email,
                from: '"Esaki-Shop" <developer1575@gmail.com>',
                subject: `Confirmación de Pedido`,
                template: 'order',
                context: {
                    nombreCliente: order.user.name,
                    numeroPedido: order.id,
                    productos: order.orderItems.map(item => ({
                        nombre: item.product.name,
                        cantidad: item.quantity,
                        precio: item.product.price,
                        subtotal: (item.product.price * item.quantity)
                    })),
                    subtotal: order.subtotal,
                    shipping: order.shipping_price,
                    total: Number(order.subtotal) + Number(order.shipping_price),
                    direccionEnvio: order.address,
                }
            });

            console.log('Correo enviado con éxito:', mailResult);
            return true;
        } catch (error: any) {
            console.error('Error al enviar confirmación de pedido:', error);
            // Información más detallada del error
            if (error.code) console.error(`Código de error: ${error.code}`);
            if (error.response) console.error(`Respuesta: ${JSON.stringify(error.response)}`);
            return false;
        }
    }

    public async sendOrderCompletedEmail(order: OrderEntity) {

    }

    public async sendVerificationEmail(to: string, verificationCode: string) {

        console.log('Verification code: ' + verificationCode);
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
            return true;
        } catch (error) {

            console.error('Error sending verification email:', error);
            return false;
        }
    }

    public async sendChangePAssMail(to: string, linkid: string) {
        try {
            await this.mailservice.sendMail({
                to: to, // Dirección de correo del destinatario
                from: '"Esaki-Shop" <developer1575@gmail.com>', // Remitente
                subject: 'Change yout pass here ', // Asunto del correo
                text: `Your link to change pass is : ${linkid}`,
            });
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

        const failedEmails: any = [];

        const subject = `Notificación: ${orderCounts} órdenes pendientes de atención`;
        const template = `
            <h2>Notificación automática del sistema</h2>
            <p>Hay <strong>${orderCounts}</strong> órdenes con estado <b>PAGADO</b> pendientes de atender.</p>
            <p>Por favor, procese estas órdenes lo antes posible.</p>
        `;

        for (const admin of admins) {
            try {
                await this.mailservice.sendMail({
                    to: admin.email,
                    subject: subject,
                    html: template,
                });
            } catch (error: any) {
                failedEmails.push({ email: admin.email, error: error.message });
            }
        }

        // Reintentar enviar a los correos que fallaron
        if (failedEmails.length > 0) {
            await this.retryFailedEmails(failedEmails, subject, template);
        }
    }

    private async retryFailedEmails(failedEmails: any[], subject: string, template: string): Promise<void> {
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
