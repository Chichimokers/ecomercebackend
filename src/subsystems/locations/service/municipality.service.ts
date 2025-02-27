import { BaseService } from '../../../common/services/base.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MunicipalityEntity } from '../entity/municipality.entity';
import { Repository } from 'typeorm';
import { ProvinceEntity } from '../entity/province.entity';
import { notFoundException } from '../../../common/exceptions/modular.exception';

@Injectable()
export class MunicipalityService extends BaseService<MunicipalityEntity> {
    protected getRepositoryName(): string {
        return 'tb_municipality';
    }

    constructor(
        @InjectRepository(MunicipalityEntity)
        private readonly municipalityRepository: Repository<MunicipalityEntity>,
        @InjectRepository(ProvinceEntity)
        private readonly provinceRepository: Repository<ProvinceEntity>,
    ) {
        super(municipalityRepository);
    }

    override async create(dto: any): Promise<MunicipalityEntity> {
        const province: ProvinceEntity = await this.provinceRepository.findOne({
            where: { id: dto.province },
        });

        notFoundException(province, 'Province');

        return this.municipalityRepository.create({
            name: dto.name,
            price: dto.price,
            province: province,
        });
    }
}
