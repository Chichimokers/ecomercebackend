import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { IConfig } from "../interfaces/config.interface";
import { promises as fs } from "fs";
import * as path from "node:path";
import { Cache } from '@nestjs/cache-manager';
import { CacheTimes } from "../../../common/constants/cachetimes.constants";
import { Cron } from "@nestjs/schedule";

@Injectable()
export class ConfigService implements OnModuleInit {
    constructor(
        @Inject(Cache)
        private readonly cache: Cache,
    ) {
    }

    private filePath = path.join(__dirname, '..', 'config.json');
    private config: IConfig = { minPriceToBuy: 0 };

    async onModuleInit() {
        console.log('Inicializando precio minimo!')
        await this.loadConfig();
    }

    @Cron('0 0 */23 * * *')
    private async loadConfig(): Promise<void> {
        try {
            const data = await fs.readFile(this.filePath, "utf8");
            this.config = JSON.parse(data);
        } catch (error) {
            this.config = { minPriceToBuy: 0 };
            await this.saveConfig();
        }

        await this.cache.set('minPriceToBuy', this.config.minPriceToBuy);
    }

    private async saveConfig(): Promise<void> {
        await fs.writeFile(this.filePath, JSON.stringify(this.config, null, 4), 'utf8');
    }

    async getMinPrice(): Promise<number> {
        return this.config.minPriceToBuy;
    }

    async setMinPrice(newPrice: number): Promise<void> {
        this.config.minPriceToBuy = newPrice;
        await this.saveConfig();
        await this.cache.set('minPriceToBuy', newPrice);
    }


}