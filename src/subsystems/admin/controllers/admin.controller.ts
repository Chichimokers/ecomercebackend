// src/subsystems/admin/controllers/cache.controller.ts
import { Body, Controller, Get, Inject, Post, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { LocalAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../auth/guards/roles.guard";
import { Roles } from "../../roles/decorators/roles.decorator";
import { roles } from "../../roles/enum/roles.enum";
import { CacheService } from "../../public/services/cacheService.service";
import { AdminService } from "../services/admin.service";
import { SetMinPriceToBuyDTO } from "../dto/minPrice.dto";

@ApiTags("Admin")
@Controller("admin")
@ApiBearerAuth()
//@UseGuards(LocalAuthGuard, RolesGuard)
export class CacheController {
    constructor(
        @Inject(CacheService)
        private readonly cacheService: CacheService,
        @Inject(AdminService)
        private readonly adminService: AdminService,
    )
    {
    }

    @Get("clear-public")
    //@Roles(roles.Admin)
    @ApiOperation({ summary: "Limpiar la caché del módulo público" })
    async clearPublicCache() {
        await this.cacheService.clearPublicCache();
        return {
            message: "Caché del módulo público limpiada correctamente",
            timestamp: new Date().toISOString()
        };
    }

    @Post("set-min-price")
    //@Roles(roles.Admin)
    @ApiOperation({ summary: "Set min price" })
    async setMinPrice(@Body() data: SetMinPriceToBuyDTO) {
        await this.adminService.setMinPriceToBuy(data.price);
        return {
            message: `Min price set to ${data.price}`,
            timestamp: new Date().toISOString()
        };
    }
}