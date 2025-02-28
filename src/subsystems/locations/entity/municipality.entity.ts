import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { IsNotEmpty, IsString } from 'class-validator';
import { ProvinceEntity } from './province.entity';
import { PriceByWeightEntity } from './priceByWeight.entity';

@Entity({ name: 'tb_municipality' })
export class MunicipalityEntity extends BaseEntity {
    @IsNotEmpty()
    @IsString()
    @Column({ length: 100 })
    name: string;

    @IsNotEmpty()
    @ManyToOne(() => ProvinceEntity, (province) => province.municipalities)
    province: ProvinceEntity;

    @IsNotEmpty()
    @OneToMany(
        () => PriceByWeightEntity,
        (priceByWeight) => priceByWeight.municipality,
        { cascade: true },
    )
    prices: PriceByWeightEntity[];
}
