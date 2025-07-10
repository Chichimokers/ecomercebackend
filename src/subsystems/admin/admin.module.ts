// src/subsystems/admin/admin.module.ts
import { Module } from '@nestjs/common';
import { PublicModule } from '../public/public.module';
import { CacheController } from "./controllers/admin.controller";
import { CacheModule } from "@nestjs/cache-manager";
import { ConfigService } from "./services/config.service";
import { AdminService } from "./services/admin.service";
import { TestController } from "./controllers/test.controller";

// Otros imports...

@Module({
    imports: [
        PublicModule,
        CacheModule.register({
            ttl: 86400,
            max: 400,
        }),// Importar el módulo público para acceder a su servicio de caché
        // Otros imports...
    ],
    controllers: [
        // Otros controladores...
        CacheController,
        TestController,
    ],
    providers: [
        ConfigService,
        AdminService,
    ],
})
export class AdminModule {}