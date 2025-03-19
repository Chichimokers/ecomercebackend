import { Inject, Injectable } from "@nestjs/common";
import { StripeService } from "./stripe.service";
import { PaypalService } from "./paypal.service";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderEntity } from "../../orders/entities/order.entity";
import { Repository } from "typeorm";
import { captureNotFoundException } from "../../../common/exceptions/modular.exception";

@Injectable()
export class PaymentsService {
    constructor(
        @InjectRepository(OrderEntity)
        private readonly orderRepository: Repository<OrderEntity>,
        @Inject(StripeService)
        private readonly stripeService: StripeService,
        @Inject(PaypalService)
        private readonly paypalService: PaypalService,
    )
    {

    }

    public async confirmPayment(orderId: string) {
        const order = await this.orderRepository.findOne({ where: {id: orderId}});

        captureNotFoundException(order, 'Order');

        if (order.stripe_id) {
            // By stripe!
            return await this.stripeService.checkPayment(order);
        }

        // By Paypal
        // TODO ERNESTO IMPLEMENTA ESTO SIGUENDO LA INTERFACE QUE CREE EN LA CARPETA INTERFACES
    }
}
