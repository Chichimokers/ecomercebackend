import { BaseService } from '../../../common/services/base.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MunicipalityEntity } from '../entity/municipality.entity';
import { Repository } from 'typeorm';
import { ProvinceEntity } from '../entity/province.entity';
import { badRequestException, notFoundException } from '../../../common/exceptions/modular.exception';
import { PriceByWeightEntity } from '../entity/priceByWeight.entity';
import { createMunicipalityDTO } from '../dto/municipalitydto/createMunicipality.dto';

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

        let pricesWeight: PriceByWeightEntity[] = [];

        for (let i = 0; i < dto.weightPrices.length; i++) {
            pricesWeight.push(
                this.priceBWERepository.create({
                    minWeight: dto.weightPrices[i].minWeight,
                    price: dto.weightPrices[i].price,
                })
            );
        }

        badRequestException(pricesWeight, 'Prices');

        const municipality: MunicipalityEntity = this.municipalityRepository.create({
            name: dto.name,
            province: province,
            prices: pricesWeight,
        });

        badRequestException(municipality, 'Municipality');

        for (let i = 0; i < pricesWeight.length; i++) {
            pricesWeight[i].municipality = municipality;
            await this.priceBWERepository.save(pricesWeight[i]);
        }

        await this.municipalityRepository.save(municipality);

        return municipality;
    }

    public async getMunicipality(id: string) {
        return await this.municipalityRepository.findOne({
            relations: {
                prices: true,
            },
            select: {
                id: true,
                name: true,
                basePrice: true,
                minHours: true,
                maxHours: true,
                prices: {
                    id: true,
                    price: true,
                    minWeight: true,
                },
            },
            where: { id: id },
            order: {
                prices: {
                    minWeight: 'DESC',
                },
            },
        });
    }

    public async getMunicipalitysByProvince(id: string){
        return await this.municipalityRepository.find({
            select: {
                id: true,
                name: true,
            },
            where: {
                province: { id: id },
            }
        });
    }
}
