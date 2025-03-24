// src/subsystems/public/services/cache.service.ts
import { Injectable, Inject } from "@nestjs/common";
import { Cache } from "@nestjs/cache-manager";

@Injectable()
export class CacheService {
    constructor(@Inject(Cache) private cacheManager: Cache) {
    }

    async clearPublicCache(): Promise<void> {
        // Función para limpiar toda la caché del módulo público
        await this.cacheManager.reset();
        console.log("Caché del módulo público limpiada correctamente");
    }

    async getMinPriceToBuy() {
        return await this.cacheManager.get("/public/min-price-to-buy{}");
    }
}