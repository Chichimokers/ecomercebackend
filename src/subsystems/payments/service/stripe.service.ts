import Stripe from "stripe";
import { Inject, Injectable } from "@nestjs/common";
import { STRIPE_SECRET_KEY, SUCCESS_URL } from "../config.payments";
import { OrderEntity } from "../../orders/entities/order.entity";
import { Repository } from "typeorm";
import { OrderService } from "../../orders/services/orders.service";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderProductEntity } from "../../orders/entities/order_products.entity";
import {
    calculateDiscount,
    getPrice
} from "../../../common/utils/global-functions.utils";
import { captureBadRequestException, captureNotFoundException } from "../../../common/exceptions/modular.exception";

@Injectable()
export class StripeService {
    private stripe: Stripe;

    constructor(
        @Inject(OrderService) public orderService: OrderService,
        @InjectRepository(OrderEntity)
        private readonly orderRepository: Repository<OrderEntity>
    ) {
        this.stripe = new Stripe(STRIPE_SECRET_KEY, {
            apiVersion: "2025-02-24.acacia"
        });
    }

    async createCheckoutSession(orderid: string, currency: string = "usd") {
        console.log('Finding Order');
        const orderEntity: OrderEntity = await this.orderRepository.findOne({
            where: { id: orderid },
            relations: [
                "user",
                "municipality",
                "orderItems",
                "orderItems.product",
                "orderItems.product.discounts"
            ] // Asegúrate de incluir la relación 'carts'
        });

        captureNotFoundException(orderEntity, "Order");

        console.log('Creating JSON ORDER');
        const order = await this.createJSONOrder(orderEntity, currency);

        console.log('Session?');
        let session: Stripe.Response<Stripe.Checkout.Session>;

        try {
            console.log('Creating SESSION!');
            session = await this.stripe.checkout.sessions.create(order);
        } catch (error) {
            throw new Error('Unable to create checkout session');
        }

        orderEntity.stripe_id = session.id;

        console.log('Saving Order!');
        await this.orderRepository.save(orderEntity);

        console.log('Returning JSONRESPONSE');
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
            created: session.created
        };
    }

    private async createJSONOrder(
        order: OrderEntity,
        currency: string = "usd"
    ): Promise<any> {
        // Comprobar si la orden existe...
        if (!order || !order.orderItems) {
            throw new Error("No se encontraron productos en la orden."); // Manejo de error
        }

        let subtotal: number = 0;
        // Calcular subtotal
        order.orderItems.forEach((orderItem: OrderProductEntity): void => {
            subtotal += calculateDiscount(
                orderItem.product,
                orderItem.quantity
            );
        });

        return {
            success_url: `${SUCCESS_URL}?order_id=${order.id.toString()}`,
            mode: "payment",
            currency: currency,
            payment_method_types: ["card"],
            metadata: {
                order_id: order.id.toString(),
                user_id: order.user.id.toString()
            },
            // Items del carrito
            line_items: order.orderItems.map(
                (orderItem: OrderProductEntity) => ({
                    price_data: {
                        currency: currency,
                        product_data: {
                            name: orderItem.product.name
                        },
                        unit_amount:
                            Math.floor((getPrice(orderItem.product, orderItem.quantity) * 100) * 100) / 100
                    },
                    quantity: orderItem.quantity
                })
            ),
            shipping_options: [this.manageShippingPrice(order, currency)]
        };
    }

    private manageShippingPrice(order: OrderEntity, currency: string = "usd") {
        captureBadRequestException(order.municipality, "Municipality");

        return {
            shipping_rate_data: {
                display_name: "Envío",
                type: "fixed_amount",
                fixed_amount: {
                    amount: order.shipping_price * 100,// Calcular precio de municipio
                    currency: currency
                },
                delivery_estimate: {
                    minimum: {
                        unit: "day",
                        value: order.municipality.minHours / 24 // Extraer del municipio
                    },
                    maximum: {
                        unit: "day",
                        value: order.municipality.maxHours / 24 // Extraer del municipio
                    }
                }
            }
        };
    }

    async CaptureCheckoutSession(order_id: string) {
        const order = await this.orderRepository.findOne({
            where: { id: order_id }
        });

        captureNotFoundException(order, 'Order');

        const sessionId = order.stripe_id;

        const session = await this.stripe.checkout.sessions.retrieve(sessionId);

        //console.log(session.payment_status);
        if (session.payment_status !== "paid") {
            return {
                checkout: {
                    status: false,
                    message: "El pago no ha sido realizado.",
                    session_url: session.url
                }
            };
        }

        // Aqui va para procesar la orden!
        const captured_id = session.metadata.order_id;

        await this.orderService.processOrders(captured_id.toString());

        // End process order
        return {
            checkout: {
                status: true,
                message: "El pago ha sido realizado con éxito."
            }
        };
    }
}
