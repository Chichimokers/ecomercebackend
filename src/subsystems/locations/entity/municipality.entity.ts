import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';
import { ProvinceEntity } from './province.entity';


@Entity({ name: "tb_municipality" })
export class MunicipalityEntity extends BaseEntity {
    @IsNotEmpty()
    @IsString()
    @Column({ length: 100 })
    name: string;

    @IsNumber()
    @IsPositive()
    @Column({ type: "float" })
    price: number;

    @IsNotEmpty()
    @ManyToOne(() => ProvinceEntity, province => province.municipalities)
    province: ProvinceEntity;
}