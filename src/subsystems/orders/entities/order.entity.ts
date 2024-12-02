import { IsBoolean, IsPositive, IsString } from "class-validator";
import { BaseEntity } from 'src/common/entities/base.entity';
import { User } from 'src/subsystems/user/entities/user.entity';
import { CartEntity } from 'src/subsystems/cart/entity/cart.entity';
import {
    Entity,
    OneToMany,
    Column,
    ManyToOne, Check
} from "typeorm";

@Entity({name:"tb_orders"})
@Check(`"subtotal" >= 0`)
export class OrderEntity  extends BaseEntity{
    @ManyToOne(() => User, (user) => user.id)
    user: User;

    @Column({ length: 15 })
    @IsString()
    phone :string

    @Column({ length: 255 })
    @IsString()
    address :string

    @Column({ length: 20 })
    @IsString()
    CI :string

    @Column()
    @IsPositive()
    subtotal: number;

    @Column({ default: true })
    @IsBoolean()
    pending: boolean;

    @Column({length: 255, nullable: true, default: null})
    @IsString()
    stripe_id: string;

    @OneToMany(() => CartEntity, (cart) => cart.order)
    carts: CartEntity[];

}
