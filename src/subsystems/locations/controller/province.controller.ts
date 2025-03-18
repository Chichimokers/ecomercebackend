import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { ProvinceService } from '../service/province.service';
import { Roles } from '../../roles/decorators/roles.decorator';
import { roles } from '../../roles/enum/roles.enum';
import { createProvinceDTO } from '../dto/provincedto/createProvince.dto';
import { ProvinceEntity } from '../entity/province.entity';
import { UpdateProvinceDTO } from '../dto/provincedto/updateProvince.dto';
import { IPagination } from "../../../common/interfaces/pagination.interface";

@ApiTags('province')
@ApiBearerAuth()
@Controller('province')
@UseGuards(LocalAuthGuard, RolesGuard)
export class ProvinceController {
    constructor(private readonly provinceService: ProvinceService) { }

    @Post()
    @Roles(roles.Admin)
    create(@Body() createProvinceDTO: createProvinceDTO): Promise<ProvinceEntity> {
        return this.provinceService.create(createProvinceDTO);
    }

    @Get()
    @Roles(roles.Admin)
    getProvinces(@Query() pagination: IPagination): Promise<ProvinceEntity[]> {
        return this.provinceService.findAll(pagination);
    }

    @Get(':id')
    @Roles(roles.Admin)
    getProvinceById(@Param('id', new ParseUUIDPipe()) id: string): Promise<ProvinceEntity> {
        return this.provinceService.findOneById(id);
    }

    @Patch(':id')
    @Roles(roles.Admin)
    updateProvince(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Body() updateProvinceDTO: UpdateProvinceDTO,
    ): Promise<Partial<ProvinceEntity>> {
        return this.provinceService.update(id, updateProvinceDTO);
    }

    @Delete(':id')
    @Roles(roles.Admin)
    deleteProvince(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
        return this.provinceService.softDelete(id);
    }
}