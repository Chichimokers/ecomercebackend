import { Check, Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";
import { ProvinceEntity } from './province.entity';
import { PriceByWeightEntity } from './priceByWeight.entity';

@Entity({ name: 'tb_municipality' })
@Check(`"min_hours" < "max_hours"`)
@Check(`"min_hours" > 0`)
@Check(`"max_hours" > 0`)
export class MunicipalityEntity extends BaseEntity {
    @IsNotEmpty()
    @IsString()
    @Column({ length: 100 })
    name: string;

    @IsNotEmpty()
    @ManyToOne(() => ProvinceEntity,
        (province) => province.municipalities,
        { nullable: false, onDelete: 'CASCADE', })
    province: ProvinceEntity;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    @Column('decimal', { precision: 10, scale: 2, name: 'base_price' })
    basePrice: number;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    @Column('smallint', { name: 'min_hours', default: 24 })
    minHours: number;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    @Column('smallint', { name: 'max_hours' })
    maxHours?: number;

    @IsNotEmpty()
    @OneToMany(
        () => PriceByWeightEntity,
        (priceByWeight) => priceByWeight.municipality,
        { cascade: true },
    )
    prices: PriceByWeightEntity[];
}
