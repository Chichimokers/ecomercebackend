import { Inject, Injectable } from "@nestjs/common";
import { StripeService } from "./stripe.service";
import { PaypalService } from "./paypal.service";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderEntity } from "../../orders/entities/order.entity";
import { IsNull, Not, Repository } from "typeorm";
import { captureBadRequestException, captureNotFoundException } from "../../../common/exceptions/modular.exception";
import { validateAndQuitPrefix } from "../utils/prefixs.utils";
import { PAYMENT_TYPE } from "../enums/prefix.constants";
import { OrderStatus } from "../../orders/enums/orderStatus.enum";
import { ValidatePrefix } from "../types/validatePrefix.type";

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

    public async confirmAllPayments(): Promise<void> {
        const pendingOrders: OrderEntity[] = await this.orderRepository.find({
            where: {
                status: OrderStatus.Pending,
                payment_id: Not(IsNull()),
            }
        });

        for (const order of pendingOrders) {
            const validatedPrefix: ValidatePrefix = validateAndQuitPrefix(order.payment_id);
            let isValid: boolean = false;

            if (validatedPrefix.type === PAYMENT_TYPE.STRIPE) {
                isValid = await this.stripeService.checkPayment(order.payment_id);
            }

            if (validatedPrefix.type === PAYMENT_TYPE.PAYPAL) {
                // TODO Waiting for checkPayment PAYPAL ERNESTO IMPLEMENTA ESTO SIGUENDO LA INTERFACE QUE CREE EN LA CARPETA INTERFACES Implement
            }

            if (isValid) {
                order.status = OrderStatus.Pending;
                await this.orderRepository.save(order);
            }
        }
    }

    public async confirmPayment(orderId: string): Promise<boolean> {
        const order: OrderEntity = await this.orderRepository.findOne({ where: {id: orderId}});

        if(order.status === OrderStatus.Paid) return true;

        captureNotFoundException(order, 'Order');
        const payment_id: ValidatePrefix = validateAndQuitPrefix(order.payment_id);

        captureBadRequestException(payment_id, 'No ha sido pagada!');

        if (payment_id.type === PAYMENT_TYPE.STRIPE) {
            // By stripe!
            return await this.stripeService.checkPayment(payment_id.id);
        }

        // By Paypal
        // TODO ERNESTO IMPLEMENTA ESTO SIGUENDO LA INTERFACE QUE CREE EN LA CARPETA INTERFACES
    }
}
