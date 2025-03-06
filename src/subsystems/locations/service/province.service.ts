import { BaseService } from '../../../common/services/base.service';
import { ProvinceEntity } from '../entity/province.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProvinceService extends BaseService<ProvinceEntity> {
    protected getRepositoryName(): string {
        return 'tb_province';
    }

    constructor(
        @InjectRepository(ProvinceEntity)
        private readonly provinceRepository: Repository<ProvinceEntity>,
    ) {
        super(provinceRepository);
    }

    public async countProvinces(): Promise<number> {
        return await this.provinceRepository.count();
    }

    public async getProvincesMapped() {
        return await this.provinceRepository.find({
            select: {
                id: true,
                name: true,
            }
        })
    }
}