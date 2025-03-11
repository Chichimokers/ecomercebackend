// src/subsystems/admin/controllers/cache.controller.ts
import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { LocalAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../auth/guards/roles.guard";
import { Roles } from "../../roles/decorators/roles.decorator";
import { roles } from "../../roles/enum/roles.enum";
import { CacheService } from "../../public/services/cacheService.service";

@ApiTags("Admin")
@Controller("admin")
@ApiBearerAuth()
@UseGuards(LocalAuthGuard, RolesGuard)
export class CacheController {
    constructor(private readonly cacheService: CacheService) {
    }

    @Get("clear-public")
    @Roles(roles.Admin)
    @ApiOperation({ summary: "Limpiar la caché del módulo público" })
    async clearPublicCache() {
        await this.cacheService.clearPublicCache();
        return {
            message: "Caché del módulo público limpiada correctamente",
            timestamp: new Date().toISOString()
        };
    }
}