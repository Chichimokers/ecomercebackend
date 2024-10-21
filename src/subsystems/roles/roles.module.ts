// src/subsystems/roles/roles.module.ts
import { Module } from '@nestjs/common';
import { Roles } from './decorators/roles.decorator'; // Importa el decorador


@Module({
  providers: [],
  exports: [], // Exporta el decorador y el enum si los necesitas en otros módulos
})
export class RolesModule {}