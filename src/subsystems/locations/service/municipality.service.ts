import { BaseService } from '../../../common/services/base.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MunicipalityService extends BaseService<MunicipalityService> {
    protected getRepositoryName(): string {
        return 'tb_municipality';
    }
}