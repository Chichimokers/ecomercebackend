import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';
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
    @IsNumber()
    @IsPositive()
    @Column('decimal', { precision: 10, scale: 2 })
    basePrice: number;

    @IsNotEmpty()
    @OneToMany(
        () => PriceByWeightEntity,
        (priceByWeight) => priceByWeight.municipality,
        { cascade: true },
    )
    prices: PriceByWeightEntity[];
}
