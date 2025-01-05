import { BaseEntity } from "../../../common/entities/base.entity";
import { Column, Entity, OneToMany, Check } from "typeorm";
import { IsBoolean, IsEmail, IsString } from "class-validator";
import { RatingEntity } from "../../rating/entity/rating.entity";

@Entity({ name: 'tb_user' })
@Check(`"rol" > 0`)
export class User extends BaseEntity {
    @Column({ type: 'varchar', length: 30 })
    @IsString()
    name: string;

    @Column({ type: 'varchar', length: 40 })
    @IsEmail()
    email: string;
    
    @Column({ type: 'smallint' })
    rol: number;
    
    @Column({ type: 'varchar', nullable: false})
    @IsString()
    password: string;

    @Column({ type: 'boolean', default: true })
    @IsBoolean()
    enabled: boolean;

    @Column({ name: 'last_login', type: 'timestamp', nullable: true })
    last_login: Date | null;

    @Column({ type: 'boolean', default: false })
    locked: boolean;

    @OneToMany(() => RatingEntity, (rating) => rating.user)
    ratings: RatingEntity[];
}

