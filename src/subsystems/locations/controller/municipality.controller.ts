import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';

@ApiTags('municipality')
@ApiBearerAuth()
@Controller('municipality')
@UseGuards(LocalAuthGuard, RolesGuard)
export class MunicipalityController {

}