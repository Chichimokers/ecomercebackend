import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { LocalAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { MunicipalityService } from '../service/municipality.service';
import { Roles } from '../../roles/decorators/roles.decorator';
import { roles } from '../../roles/enum/roles.enum';
import { ProvinceEntity } from '../entity/province.entity';
import { MunicipalityEntity } from '../entity/municipality.entity';
import { UpdateMunicipalityDTO } from '../dto/municipalitydto/updateMunicipality.dto';
import { createMunicipalityDTO } from '../dto/municipalitydto/createMunicipality.dto';
import { GetMunicipalityDTO } from "../dto/municipalitydto/getMunicipality.dto";

@ApiTags('municipality')
@ApiBearerAuth()
@Controller('municipality')
@UseGuards(LocalAuthGuard, RolesGuard)
export class MunicipalityController {
    constructor(private readonly municipalityService: MunicipalityService) { }

    @Post()
    @Roles(roles.Admin)
    create(@Body() createMunicipalityDTO: createMunicipalityDTO) {
        return this.municipalityService.create(createMunicipalityDTO);
    }

    @Get()
    @ApiResponse({ status: 200, type: [GetMunicipalityDTO] })
    @Roles(roles.Admin)
    getMunicipalities() {
        return this.municipalityService.findAll();
    }

    @Get(':id')
    @Roles(roles.Admin)
    getMunicipalityById(@Param('id', new ParseUUIDPipe()) id: string): Promise<MunicipalityEntity> {
        return this.municipalityService.findOneById(id);
    }

    @Patch(':id')
    @Roles(roles.Admin)
    updateMunicipality(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Body() updateProvinceDTO: UpdateMunicipalityDTO,
    ): Promise<Partial<ProvinceEntity>> {
        return this.municipalityService.update(id, updateProvinceDTO);
    }

    @Delete(':id')
    @Roles(roles.Admin)
    deleteMunicipality(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
        return this.municipalityService.softDelete(id);
    }
}