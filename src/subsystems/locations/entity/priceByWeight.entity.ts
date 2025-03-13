import { Check, Column, Entity, Index, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { IsNotEmpty, IsNumber, IsOptional, IsPositive } from 'class-validator';
import { MunicipalityEntity } from './municipality.entity';

@Entity({ name: 'tb_price_by_weight' })
@Index(['municipality', 'minWeight'], { unique: true })
@Check(`"price" > 0`)
@Check(`"minWeight" > 0`)
export class PriceByWeightEntity extends BaseEntity {
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @IsOptional()
    @IsNumber()
    @Column({ type: 'float' })
    minWeight: number;

    @ManyToOne(() => MunicipalityEntity, (municipality) => municipality.prices)
    municipality: MunicipalityEntity;
}
