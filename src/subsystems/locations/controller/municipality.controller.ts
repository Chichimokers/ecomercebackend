import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { LocalAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { MunicipalityService } from '../service/municipality.service';
import { Roles } from '../../roles/decorators/roles.decorator';
import { roles } from '../../roles/enum/roles.enum';
import { MunicipalityEntity } from '../entity/municipality.entity';
import { UpdateMunicipalityDTO } from '../dto/municipalitydto/updateMunicipality.dto';
import { createMunicipalityDTO } from '../dto/municipalitydto/createMunicipality.dto';
import { GetMunicipalityDTO } from "../dto/municipalitydto/getMunicipality.dto";
import { IPagination } from "../../../common/interfaces/pagination.interface";

@ApiTags('municipality')
@ApiBearerAuth()
@Controller('municipality')
@UseGuards(LocalAuthGuard, RolesGuard)
export class MunicipalityController {
    constructor(private readonly municipalityService: MunicipalityService) { }

    @Post()
    @Roles(roles.Admin)
    create(@Body() createMunicipalityDTO: createMunicipalityDTO): Promise<MunicipalityEntity> {
        return this.municipalityService.create(createMunicipalityDTO);
    }

    @Get()
    @ApiResponse({ status: 200, type: [GetMunicipalityDTO] })
    @Roles(roles.Admin)
    getMunicipalities(@Query() pagination?: IPagination): Promise<MunicipalityEntity[]> {
        return this.municipalityService.findAll(pagination);
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
        @Body() updateMunicipalityDTO: UpdateMunicipalityDTO,
    ): Promise<Partial<MunicipalityEntity>> {
        return this.municipalityService.update(id, updateMunicipalityDTO);
    }

    @Delete(':id')
    @Roles(roles.Admin)
    deleteMunicipality(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
        return this.municipalityService.softDelete(id);
    }
}