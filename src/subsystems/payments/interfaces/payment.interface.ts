import { OrderEntity } from "../../orders/entities/order.entity";

export interface IPaymentCheck {
    /**
     * A Boolean function to verify if the order has been paid or not
     * @param order Order entity to get information!
     */
    checkPayment(order: OrderEntity): Promise<boolean>;
}