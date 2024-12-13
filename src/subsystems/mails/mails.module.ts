import { Module } from "@nestjs/common";
import { MailsService } from "./services/mails.service";

@Module({
    imports:[],
    providers:[MailsService],
    controllers:[],
})
export class MailsModule {}