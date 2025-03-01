import Stripe from 'stripe';
import { Inject, Injectable } from '@nestjs/common';
import { HOST, STRIPE_SECRET_KEY } from '../config.payments';
import { OrderEntity } from '../../orders/entities/order.entity';
import { Repository } from 'typeorm';
import { OrderService } from '../../orders/services/orders.service';
import { InjectRepository } from '@nestjs/typeorm';
import { toNumber } from '../../../common/utils/cast.utils';
import { OrderProductEntity } from '../../orders/entities/order_products.entity';
import {
    calculateDiscount,
    getPrice,
} from '../../../common/utils/global-functions.utils';
import { notFoundException } from '../../../common/exceptions/modular.exception';

@Injectable()
export class StripeService {
    private stripe: Stripe;
    constructor(
        @Inject(OrderService) public orderService: OrderService,
        @InjectRepository(OrderEntity)
        private readonly orderRepository: Repository<OrderEntity>,
    ) {
        this.stripe = new Stripe(STRIPE_SECRET_KEY, {
            apiVersion: "2025-01-27.acacias",
        });
    }

    async createCheckoutSession(orderid: string, currency: string = 'usd') {
        const orderEntity: OrderEntity = await this.orderRepository.findOne({
            where: { id: orderid },
            relations: [
                'user',
                'orderItems',
                'orderItems.product',
                'orderItems.product.discounts',
            ], // Asegúrate de incluir la relación 'carts'
        });

        notFoundException(orderEntity, 'Order');

        const order = await this.createJSONOrder(orderEntity, currency);

        const session = await this.stripe.checkout.sessions.create(order);

        //const order_find: OrderEntity = await this.orderRepository.findOne({where: {id: orderid}});

        orderEntity.stripe_id = session.id;

        await this.orderRepository.save(orderEntity);

        return await this.createJSONResponse(session);
    }

    private async createJSONResponse(session: any) {
        return {
            id: session.id,
            amount_total: session.amount_total,
            currency: session.currency,
            payment_status: session.payment_status,
            url: session.url,
            success_url: session.success_url,
            metadata: session.metadata,
            created: session.created,
        };
    }

    private async createJSONOrder(
        order: OrderEntity,
        currency: string = 'usd',
    ): Promise<any> {
        // Comprobar si la orden existe...
        if (!order || !order.orderItems) {
            throw new Error('No se encontraron productos en la orden.'); // Manejo de error
        }

        let subtotal: number = 0;
        // Calcular subtotal
        order.orderItems.forEach((orderItem: OrderProductEntity): void => {
            subtotal += calculateDiscount(
                orderItem.product,
                orderItem.quantity,
            );
        });

        return {
            success_url: `${HOST}/visa-mastercard/capture-payment?order_id=${order.id.toString()}`,
            mode: 'payment',
            currency: currency,
            payment_method_types: ['card'],
            metadata: {
                order_id: order.id.toString(),
                user_id: order.user.id.toString(),
            },
            // Items del carrito
            line_items: order.orderItems.map(
                (orderItem: OrderProductEntity) => ({
                    price_data: {
                        currency: currency,
                        product_data: {
                            name: orderItem.product.name,
                        },
                        unit_amount:
                            getPrice(orderItem.product, orderItem.quantity) *
                            100,
                    },
                    quantity: orderItem.quantity,
                }),
            ),
        };
    }

    async CaptureCheckoutSession(order_id: string) {
        const order = await this.orderRepository.findOne({
            where: { id: order_id },
        });

        const sessionId = order.stripe_id;

        const session = await this.stripe.checkout.sessions.retrieve(sessionId);

        console.log(session.payment_status);
        if (session.payment_status !== 'paid') {
            return {
                checkout: {
                    status: false,
                    message: 'El pago no ha sido realizado.',
                    session_url: session.url,
                },
            };
        }

        // Aqui va para procesar la orden!
        const captured_id = toNumber(session.metadata.order_id);

        await this.orderService.processOrders(captured_id.toString());

        // End process order
        return {
            checkout: {
                status: true,
                message: 'El pago ha sido realizado con éxito.',
            },
        };
    }
}
