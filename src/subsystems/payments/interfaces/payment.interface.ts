export interface IPaymentCheck {
    /**
     * A Boolean function to verify if the payment_id has been paid or not
     * @param payment_id Payment id to get information!
     */
    checkPayment(payment_id: string): Promise<boolean>;
}