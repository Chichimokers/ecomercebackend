import { BaseService } from '../../../common/services/base.service';
import { ProvinceEntity } from '../entity/province.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProvinceService extends BaseService<ProvinceEntity> {
    protected getRepositoryName(): string {
        return 'tb_province';
    }
}