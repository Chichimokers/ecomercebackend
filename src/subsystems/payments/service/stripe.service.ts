import Stripe from 'stripe';
import { Injectable } from "@nestjs/common";
import { STRIPE_SECRET_KEY } from "../config.payments";
import { OrderEntity } from "../../orders/entities/order.entity";

@Injectable()
export class StripeService {
    private stripe: Stripe;
    constructor() {
        this.stripe = new Stripe(STRIPE_SECRET_KEY, {
            apiVersion: '2024-09-30.acacia',
        });
    }

    async createPaymentIntent(amount: number, currency: string='usd') {
        return await this.stripe.paymentIntents.create({
            amount: amount,
            currency: currency,
            payment_method_types: ['card'],
            metadata: {
            }
        });
    }

    private async createJSONOrder(cart: OrderEntity, currency: string) :Promise<any> {
        if (!cart || !cart.carts) {
            throw new Error("No se encontraron carts en la orden."); // Manejo de error
        }

        const { v4: uuidv4} = require('uuid');
        let requestId = uuidv4();



    }
}