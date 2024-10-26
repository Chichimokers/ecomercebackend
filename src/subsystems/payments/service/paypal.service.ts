import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CLIENTID, HOST, PAYPAL_HOST, SECRET_KEY } from '../config.payments';
import axios from 'axios';
import { OrderEntity } from 'src/subsystems/orders/entities/order.entity';
import { OrderService } from 'src/subsystems/orders/services/orders.service';


@Injectable()
export class PaypalService {
    constructor(
        @Inject(OrderService) public orderService:OrderService,
        @InjectRepository(OrderEntity)
        private readonly orderRepository: Repository<OrderEntity>,
    ) { }
    async confirmorder(token: string): Promise<boolean> {

        const authd = {

            username: CLIENTID,
            password: SECRET_KEY
        }
        const response = await axios.post(`${PAYPAL_HOST}/v2/checkout/orders/${token}/capture`, {}, {

            auth: authd,
            headers: {
                "Content-Type": "application/json",
            }

        })

        // Te sustitui el if else que tenias aqui, BORRA ESTE COMENTARIO
        return response.data.status === "COMPLETED";
    }

    async CreateJSONOrder(carts: OrderEntity, moneda: string) :Promise<any>{
        const { v4: uuidv4 } = require('uuid');
        let requestId = uuidv4(); // Genera un UUID
        
        if (!carts || !carts.carts) {
            throw new Error("No se encontraron carts en la orden."); // Manejo de error
        }
        // Calcular el subtotal
        let subtotal = 0 ;
        carts.carts.forEach(cart => {
            subtotal += cart.total; // Sumar el total de cada cart
        });
        const order = {
            intent: "CAPTURE",
            purchase_units: [
                {
                    reference_id: requestId, // Usar el UUID generado
                    amount: {
                        currency_code: moneda,
                        value: subtotal, // Asignar el subtotal calculado

                        breakdown: {
                            item_total: {
                                currency_code: moneda,
                                value: subtotal // Asignar el subtotal calculado
                            }
                        }
                    },
                    items: carts.carts.map(cart => ({
                        name: cart.item.name, // Asumiendo que cada cart tiene un atributo 'productName'
                        unit_amount: {
                            currency_code: moneda,
                            value: cart.item.price.toFixed(2) // Asumiendo que cada cart tiene un atributo 'price'
                        },
                        quantity: cart.quantity.toString() // Asumiendo que cada cart tiene un atributo 'quantity'
                    }))
                },
            ],
            payment_source: {
                paypal: {
                    experience_context: {
                        payment_method_preference: "IMMEDIATE_PAYMENT_REQUIRED",
                        brand_name: "ESAKISHOP INC",
                        landing_page: "LOGIN",
                        user_action: "PAY_NOW",
                        return_url: `${HOST}/payments/capture-order`,
                        cancel_url: `${HOST}/payments/cancel-order`
                    }
                }
            }
        };

        return order
    }

    async CreateOrder(orderid:number,userid:string): Promise<string> {
        
        const orderbd: OrderEntity = await this.orderRepository.findOne({
            where: { id: orderid },
            relations: ['carts','carts.item'], // Asegúrate de incluir la relación 'carts'
        });

        let order: string = "";
        if(userid.toString() === orderbd.id.toString()){
            if (orderbd) {
                order = await this.CreateJSONOrder(orderbd, "USD");
    
            }else{
            throw new Error("No se encontro en la bd ");
    
            }
        } else {
            throw new Error("Esa orden no pertence a ese usuario ");
        }

        //Obteniendo Token
        const paramas = new URLSearchParams();
        paramas.append("grant_type", "client_credentials");
        const auth = {

            username: CLIENTID,
            password: SECRET_KEY
        }
        const { data } = await axios.post(`${PAYPAL_HOST}/v1/oauth2/token`, paramas, {
            auth: auth
        })

        const response = await axios.post(`${PAYPAL_HOST}/v2/checkout/orders`, order, {
            headers: {
                Authorization: `Bearer ${data.access_token}`,
                "Content-Type": "application/json",
            }
        })

        return response.data.links[1];
    }
}
