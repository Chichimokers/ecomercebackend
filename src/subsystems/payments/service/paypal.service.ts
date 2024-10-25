import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from 'src/subsystems/products/entity/product.entity';
import { Repository, Like, DataSource } from 'typeorm';
import { CLIENTID, HOST, PAYPAL_HOST, SECRET_KEY } from '../config.payments';
import axios from 'axios';
import { response } from 'express';
import { IsString } from 'class-validator';


@Injectable()
export class PaypalService {
    constructor()
    { }
 async confirmorder(token:string): Promise<boolean>{
            
    const authd  = { 

        username:CLIENTID,
        password:SECRET_KEY
    }
   const response = await axios.post(`${PAYPAL_HOST}/v2/checkout/orders/${token}/capture`,{},{

        auth:authd,
        headers:{
            "Content-Type":"application/json",
        }

    })
    
    console.log(response)

    if(response.data.status === "COMPLETED"){

        return true
        
    }else{

        return false
    }
 }
 

 async CreateOrder() : Promise<string>{
    const { v4: uuidv4 } = require('uuid');
    let requestId = uuidv4(); // Genera un nuevo UUID
    
    const order = {
        intent: "CAPTURE",
        purchase_units: [
            {
                reference_id: requestId, // Usar el UUID generado
                amount: {
                    currency_code: "USD",
                    value: "100.00"
                }
            }
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
    
    //Obteniendo Token
    const paramas = new URLSearchParams();
    paramas.append("grant_type","client_credentials");
    const auth  = { 

        username:CLIENTID,
        password:SECRET_KEY
    }
     const { data } =   await axios.post(`${PAYPAL_HOST}/v1/oauth2/token`,paramas,{
        auth:auth
    })


    const response =  await axios.post(`${PAYPAL_HOST}/v2/checkout/orders`,order,{
        headers:{
            Authorization:`Bearer ${data.access_token}`,
            "Content-Type":"application/json",
        }
    }) 


    
    return response.data.links[1];
 }
 
}
