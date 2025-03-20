import { Inject, Injectable } from "@nestjs/common";
import { StripeService } from "./stripe.service";
import { PaypalService } from "./paypal.service";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderEntity } from "../../orders/entities/order.entity";
import { Repository } from "typeorm";
import { captureBadRequestException, captureNotFoundException } from "../../../common/exceptions/modular.exception";
import { validateAndQuitPrefix } from "../utils/prefixs.utils";
import { PAYMENT_TYPE } from "../enums/prefix.constants";
import { OrderStatus } from "../../orders/enums/orderStatus.enum";

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

        if(order.status === OrderStatus.Paid) {
            return true;
        }

        captureNotFoundException(order, 'Order');
        console.log(order);
        const payment_id = validateAndQuitPrefix(order.payment_id);
        console.log(payment_id);

        captureBadRequestException(payment_id, 'No ha sido pagada!');

        if (payment_id.type === PAYMENT_TYPE.STRIPE) {
            // By stripe!
            return await this.stripeService.checkPayment(payment_id.id);
        }

        // By Paypal
        // TODO ERNESTO IMPLEMENTA ESTO SIGUENDO LA INTERFACE QUE CREE EN LA CARPETA INTERFACES
    }
}
