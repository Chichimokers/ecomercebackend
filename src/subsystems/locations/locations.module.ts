import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ProvinceEntity } from './entity/province.entity';
import { MunicipalityEntity } from './entity/municipality.entity';
import { MunicipalityController } from './controller/municipality.controller';
import { ProvinceController } from './controller/province.controller';
import { ProvinceService } from './service/province.service';
import { MunicipalityService } from './service/municipality.service';
import { PriceByWeightEntity } from './entity/priceByWeight.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ProvinceEntity,
            MunicipalityEntity,
            PriceByWeightEntity,
        ]),
        ConfigModule.forRoot({ isGlobal: true }),
    ],
    controllers: [ProvinceController, MunicipalityController],
    providers: [ProvinceService, MunicipalityService],
    exports: [ProvinceService, MunicipalityService],
})
export class LocationsModule {}