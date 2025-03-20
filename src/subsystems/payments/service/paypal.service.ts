import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CLIENTID, HOST, PAYPAL_HOST, SECRET_KEY } from '../config.payments';
import axios, { AxiosError } from 'axios';
import { OrderEntity } from 'src/subsystems/orders/entities/order.entity';
import { OrderService } from 'src/subsystems/orders/services/orders.service';
import {
    calculateDiscount,
    getPrice,
} from 'src/common/utils/global-functions.utils';
import { captureNotFoundException } from '../../../common/exceptions/modular.exception';
import { MunicipalityEntity } from 'src/subsystems/locations/entity/municipality.entity';
import { OrderProductEntity } from 'src/subsystems/orders/entities/order_products.entity';
import { ConfirmOrder } from '../interfaces/confirmOrderPaypal';

@Injectable()
export class PaypalService {
    constructor(
        @Inject(OrderService) public orderService: OrderService,
      
        @InjectRepository(MunicipalityEntity)
        private readonly municipalitirepository:Repository<MunicipalityEntity>,
        @InjectRepository(OrderEntity)
        private readonly orderRepository: Repository<OrderEntity>,
        @InjectRepository(OrderProductEntity)
        private readonly orderentitytsts: Repository<OrderProductEntity>,
    ) {}
    async cancelorder(token: string): Promise<boolean> {
        const authd = {
            username: CLIENTID,
            password: SECRET_KEY,
        };
       
       const response = await axios.get(
                `${PAYPAL_HOST}/v2/checkout/orders/${token}`,{        

                    auth: authd,
                    headers: {
                        'Content-Type': 'application/json',
                    },

                });

        if(response.data.status != 'COMPLETED'){
            
            const orderid =   response.data.purchase_units[0].custom_id

            let entidades: OrderProductEntity[] = await this.orderentitytsts.find({
                where:{order:{id : orderid}},
                relations:{
                order:{}
            }})
            entidades.map((item) => {

                 this.orderentitytsts.delete(item.id)
                
            })
            // Eliminar el padre
            const result = await this.orderService.delete(orderid);
            
            console.log(result)

            return true

        }else{
     return false

        }

     
        
    }
    //Confimar orden con el token de paypal
    async confirmorder(token: string): Promise<ConfirmOrder> {

        const authd = {
            username: CLIENTID,
            password: SECRET_KEY,
        };
        const response = await axios.post(
            `${PAYPAL_HOST}/v2/checkout/orders/${token}/capture`,
            {},
            {
               auth: authd,
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        );

        if (response.data.status === 'COMPLETED') {
            await this.orderService.processOrders(
                response.data.purchase_units[0].payments.captures[0].custom_id,
            );
        }

        return {paid : response.data.status === 'COMPLETED',orderid: response.data.purchase_units[0].payments.captures[0].custom_id};
    }
    //Crear el json del a orden a partir de la entidad de la orden
    async CreateJSONOrder(
        carts: OrderEntity,
        moneda: string,
        precioenvio: number,
    ): Promise<any> {
        // Verificar si la orden existe

        if (!carts || !carts.orderItems) {
            throw new Error('No se encontraron carts en la orden.'); // Manejo de error
        }

        const { v4: uuidv4 } = require('uuid');
        let requestId: any = uuidv4(); // Genera un UUID

        // Calcular el subtotal
        let subtotal: number = 0;
        carts.orderItems.forEach((cart) => {
            subtotal += calculateDiscount(cart.product, cart.quantity); // Sumar el total de cada cart
        });

        const order = {
            intent: 'CAPTURE',
            purchase_units: [
                {
                    custom_id: carts.id.toString(),
                    reference_id: requestId, // Usar el UUID generado
                    amount: {
                        currency_code: moneda,
                        value: (Number(subtotal) +Number( precioenvio)).toFixed(2), // Asignar el subtotal calculado + precio de envio 

                        breakdown: {
                            item_total: {
                                currency_code: moneda,
                                value: Number(subtotal).toFixed(2), // Asignar el subtotal calculado
                            },
                        shipping: {
                                currency_code:  moneda,                           
                                value: Number(precioenvio).toFixed(2) //Asignar el total de envio
                              }
                        },
                    },
                    
                    //TODO Items
                 
                },
            ],   items: [
                carts.orderItems.map((item) => ({
                    name: item.product.name, // Asumiendo que cada cart tiene un atributo 'productName'
                    unit_amount: {
                        currency_code: moneda,
                        value: Number(getPrice(
                            item.product,
                            item.quantity,
                        )).toFixed(2), // Asumiendo que cada cart tiene un atributo 'price'
                    },
                    quantity: item.quantity.toString(), // Asumiendo que cada cart tiene un atributo 'quantity'
                }))
         ],
            payment_source: {
                paypal: {
                    experience_context: {
                        payment_method_preference: 'IMMEDIATE_PAYMENT_REQUIRED',
                        brand_name: 'ESAKISHOP INC',
                        landing_page: 'LOGIN',
                        user_action: 'PAY_NOW',
                        return_url: `${HOST}/payments/capture-order`,
                        cancel_url: `${HOST}/payments/cancel-order`,
                    },
                },
            },
        };

        return order;
    }
    async calcularprecio_envio__by_kg_and_municipality(kg:number,municipaliti_id:string): Promise<number> {
        // Validación de productos
   
        // Cálculo de peso total con validación
        const pesoTotal = kg;

        if (pesoTotal <= 0) throw new Error('Peso total inválido');

        // Validación de estructura de municipio
        const municipio =await  this.municipalitirepository.findOne({
            relations: {
            
                prices: true,
            },
            where: { id: municipaliti_id.toString() },
        })


        if (!municipio?.prices || !municipio.prices?.length) {
            return municipio?.prices.length || 0; // Si no hay precios especiales
        }

        // Procesamiento de precios
        const preciosOrdenados = [...municipio.prices]
            .filter((p) => p.minWeight !== null && p.minWeight > 0)
            .sort((a, b) => b.minWeight! - a.minWeight!);

        // Encontrar el primer precio que aplica
        const precioAplicable = preciosOrdenados.find(
            (p) => pesoTotal >= p.minWeight!,
        );

        return precioAplicable?.price ?? municipio.basePrice;
    }

    // TODO Review and FIX this method
    async calcularprecio_envio(order: OrderEntity): Promise<number> {
        // Validación de productos
        if (!order.orderItems?.length) {
            throw new Error('La orden no contiene productos');
        }

        // Cálculo de peso total con validación
        const pesoTotal = order.orderItems.reduce((total, item) => {
            if (!item.product?.weight || item.product.weight <= 0) {
                throw new Error(
                    `Peso inválido en producto: ${item.product?.id}`,
                );
            }
            return total + item.product.weight * item.quantity;
        }, 0);

        if (pesoTotal <= 0) throw new Error('Peso total inválido');

        // Validación de estructura de municipio
        const municipio = order.municipality;
        if (!municipio?.prices || !municipio.prices?.length) {
            return municipio?.prices.length || 0; // Si no hay precios especiales
        }

        // Procesamiento de precios
        const preciosOrdenados = [...municipio.prices]
            .filter((p) => p.minWeight !== null && p.minWeight > 0)
            .sort((a, b) => b.minWeight! - a.minWeight!);

        // Encontrar el primer precio que aplica
        const precioAplicable = preciosOrdenados.find(
            (p) => pesoTotal >= p.minWeight!,
        );

        return precioAplicable?.price ??  municipio.basePrice;
    }

    async CreateOrder(orderid: string, userid: string): Promise<string> {

        const orderbd: OrderEntity = await this.orderRepository.findOne({
            where: { id: orderid },
            relations: {
                user:true,
                orderItems:{
                    product:{
                        discounts:{
                            products: true
                        }
                    }
                },
                municipality:{
                    prices:true
                      
                }
            }
        });
        console.log(orderbd)
        const precioenvio: number = await this.calcularprecio_envio(orderbd);
   
        let order: string = '';

        if (userid.toString() !== orderbd.user.id.toString()) {
            throw new Error('Esa orden no pertenece a ese usuario');
        }

        captureNotFoundException(orderbd, 'Order');

        order = await this.CreateJSONOrder(orderbd, 'USD', precioenvio);
        console.log(order)
        //Obteniendo Token
        const paramas = new URLSearchParams();

        paramas.append('grant_type', 'client_credentials');

        const auth = {
            username: CLIENTID,
            password: SECRET_KEY,
        };
        const { data } = await axios.post(
            `${PAYPAL_HOST}/v1/oauth2/token`,
            paramas,
            {
                auth: auth,
            },
        );
        try {
        const response = await axios.post(
            `${PAYPAL_HOST}/v2/checkout/orders`,
            order,
            {
                headers: {
                    Authorization: `Bearer ${data.access_token}`,
                    'Content-Type': 'application/json',
                },
            },
        );
        return response.data.links[1];
    } catch (error) {
        const axiosError = error as AxiosError;
        console.log(axiosError)
    }
     
    }
}
