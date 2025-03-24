import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "./config.service";

@Injectable()
export class AdminService {
    constructor(
        @Inject(ConfigService)
        private readonly config: ConfigService,
    ) {
    }

    public async setMinPriceToBuy(number: number) {
        await this.config.setMinPrice(number);
    }
}