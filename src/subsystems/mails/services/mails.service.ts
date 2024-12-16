import { Injectable } from "@nestjs/common";
import { OrderEntity } from "src/subsystems/orders/entities/order.entity";
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailsService {
    constructor(public mailservice : MailerService ) {
    }


    public sendOrderMail(order: OrderEntity,email:string){

    this.mailservice.sendMail({
            to:email
    })

    }


}