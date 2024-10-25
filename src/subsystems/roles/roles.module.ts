// src/subsystems/roles/roles.module.ts
import { Module } from '@nestjs/common';

@Module({
  providers: [],
  exports: [], // Exporta el decorador y el enum si los necesitas en otros módulos
})
export class RolesModule {}