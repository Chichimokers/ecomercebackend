import { Injectable, OnModuleInit } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { Scrapper } from "../../../common/utils/externals.utils";

@Injectable()
export class ScrapSchedule implements OnModuleInit {
    private cachedData: any;

    async onModuleInit(): Promise<void> {
        if (process.env.SCHEDULES === 'true'){
            console.log('ScrapSchedule module initialized');
            await this.scrapFunction();
        }
    }

    @Cron('0 0 */8 * * *')
    async scrapSchedule(): Promise<void> {
        if (process.env.SCHEDULES === 'true') {
            console.log('ScrapSchedule schedule called');
            await this.scrapFunction();
        }
    }

    async scrapFunction(): Promise<void> {
        const scrapper = new Scrapper();
        this.cachedData = await scrapper.get();
    }

    public get() {
        return this.cachedData;
    }
}