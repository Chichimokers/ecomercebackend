import { BaseService } from '../../../common/services/base.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MunicipalityEntity } from '../entity/municipality.entity';
import { Repository } from 'typeorm';
import { ProvinceEntity } from '../entity/province.entity';
import { badRequestException, notFoundException } from '../../../common/exceptions/modular.exception';
import { PriceByWeightEntity } from '../entity/priceByWeight.entity';

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
        @InjectRepository(PriceByWeightEntity)
        private readonly priceBWERepository: Repository<PriceByWeightEntity>,
    ) {
        super(municipalityRepository);
    }

    override async create(dto: any): Promise<MunicipalityEntity> {
        const province: ProvinceEntity = await this.provinceRepository.findOne({
            where: { id: dto.province },
        });

        notFoundException(province, 'Province');

        let prices: PriceByWeightEntity = this.priceBWERepository.create({

            price: dto.prices.price,
            weight:dto.prices.weight
        });

        badRequestException(prices, 'Prices');

        const municipality: MunicipalityEntity = this.municipalityRepository.create({
            name: dto.name,
            province: province,
            prices: [prices],
        });

        badRequestException(municipality, 'Municipality');

        prices.municipality = municipality;

        await this.priceBWERepository.save(prices);
        await this.municipalityRepository.save(municipality);

        return municipality;
    }
}
