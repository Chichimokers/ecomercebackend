import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { IsNotEmpty, IsString } from 'class-validator';
import { MunicipalityEntity } from './municipality.entity';


@Entity({ name: "tb_province" })
export class ProvinceEntity extends BaseEntity {
    @IsNotEmpty()
    @IsString()
    @Column({ length: 100, unique: true })
    name: string;

    @OneToMany(() => MunicipalityEntity, municipality => municipality.province)
    municipalities: MunicipalityEntity[];
}