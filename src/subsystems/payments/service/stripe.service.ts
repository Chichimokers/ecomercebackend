import Stripe from 'stripe';
import { Inject, Injectable } from '@nestjs/common';
import { STRIPE_SECRET_KEY } from '../config.payments';
import { OrderEntity } from '../../orders/entities/order.entity';
import { Repository } from 'typeorm';
import { OrderService } from '../../orders/services/orders.service';
import { InjectRepository } from '@nestjs/typeorm';
import { toNumber } from '../../../common/utils/cast.utils';

@Injectable()
export class StripeService {
    private stripe: Stripe;
    constructor(
        @Inject(OrderService) public orderService: OrderService,
        @InjectRepository(OrderEntity)
        private readonly orderRepository: Repository<OrderEntity>,
    ) {
        this.stripe = new Stripe(STRIPE_SECRET_KEY, {
            apiVersion: '2024-11-20.acacia',
        });
    }

    async createCheckoutSession(orderid: number, currency: string = 'usd') {
        const cart: OrderEntity = await this.orderRepository.findOne({
            where: { id: orderid },
            relations: ['carts', 'carts.item', 'user'], // Asegúrate de incluir la relación 'carts'
        });

        const order = await this.createJSONOrder(cart, currency);

        console.log(order);

        const session = await this.stripe.checkout.sessions.create(order);

        const order_find = await this.orderRepository.findOne({where: {id: orderid}});

        order_find.stripe_id = session.id;

        await this.orderRepository.save(order_find);

        return await this.createJSONResponse(session);
    }

    private async createJSONResponse(session) {
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
        cart: OrderEntity,
        currency: string = 'usd',
    ): Promise<any> {
        if (!cart || !cart.carts) {
            throw new Error('No se encontraron carts en la orden.'); // Manejo de error
        }

        let subtotal = 0;
        cart.carts.forEach((cartItem) => {
            subtotal += cartItem.total;
        });

        return {
            success_url: `http://localhost:3000/visa-mastercard/capture-payment?order_id=${cart.id.toString()}`,
            mode: 'payment',
            currency: currency,
            payment_method_types: ['card'],
            metadata: {
                order_id: cart.id.toString(),
                user_id: cart.user.id.toString(),
            },
            line_items: cart.carts.map((cartItem) => ({
                price_data: {
                    currency: currency,
                    product_data: {
                        name: cartItem.item.name,
                    },
                    unit_amount: cartItem.item.price * 100,
                },
                quantity: cartItem.quantity,
            })),
        };
    }

    async CaptureCheckoutSession(order_id: number) {
        const order = await this.orderRepository.findOne({ where: { id: order_id } });

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

        console.log(captured_id);

        await this.orderService.processOrders(captured_id);

        // End process order
        return {
            checkout: {
                status: true,
                message: 'El pago ha sido realizado con éxito.',
            },
        };
    }
}