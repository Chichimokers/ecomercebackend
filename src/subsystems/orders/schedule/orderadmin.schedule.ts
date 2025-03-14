import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderEntity } from "../entities/order.entity";
import { Repository } from "typeorm";
import { OrderStatus } from "../enums/orderStatus.enum";
import { MailsService } from "../../mails/services/mails.service";

@Injectable()
export class OrderAdminSchedule {
    constructor(
        @InjectRepository(OrderEntity)
        private readonly orderRepository: Repository<OrderEntity>,
        @Inject(MailsService)
        private readonly mailsService: MailsService,
    ) {
    }

    @Cron('0 0 */4 * * *')
    async notify(): Promise<void> {
        if (process.env.SCHEDULES === 'true'){
            console.log('Running admin notifications')
            await this.schedule();
        }
    }

    private async schedule(): Promise<void> {
        const counter: number = await this.orderRepository.count({ where: { status: OrderStatus.Paid } });

        if(counter > 0) {
            await this.mailsService.sendNotificationEmails(counter);
        }
    }
}