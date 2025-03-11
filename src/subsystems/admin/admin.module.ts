// src/subsystems/admin/admin.module.ts
import { Module } from '@nestjs/common';
import { PublicModule } from '../public/public.module';
import { CacheController } from "./controllers/admin.controller";

// Otros imports...

@Module({
  imports: [
    PublicModule, // Importar el módulo público para acceder a su servicio de caché
    // Otros imports...
  ],
  controllers: [
    // Otros controladores...
      CacheController,
  ],
  providers: [/* ... */],
})
export class AdminModule {}