import { IsPositive, IsString } from "class-validator";
import { BaseEntity } from "../../../common/entities/base.entity";
import { User } from '../../user/entities/user.entity';
import {
    Entity,
    Column,
    ManyToOne, Check, OneToMany
} from "typeorm";
import { OrderProductEntity } from "./order_products.entity";
import { OrderStatus } from "../enums/orderStatus.enum";

@Entity({name:"tb_orders"})
@Check(`"subtotal" >= 0`)
export class OrderEntity  extends BaseEntity{
    @ManyToOne((): typeof User => User, (user: User): string => user.id)
    user: User;

    @Column({ length: 70, nullable: false })
    @IsString()
    receiver_name: string;

    @Column({ length: 15 })
    @IsString()
    phone :string

    @Column({ length: 20 })
    @IsString()
    province :string

    @Column({ length: 255 })
    @IsString()
    address :string

    @Column({ length: 20 })
    @IsString()
    CI :string

    @Column({ type: 'numeric', precision: 10, scale: 2 })
    @IsPositive()
    subtotal: number;

    @Column({
        type: "enum",
        enum: OrderStatus,
        default: OrderStatus.Pending,
    })
    status: OrderStatus;

    @Column({length: 255, nullable: true, default: null})
    @IsString()
    stripe_id: string;
    
    @OneToMany(() => OrderProductEntity, (orderItem) => orderItem.order)
    orderItems: OrderProductEntity[];

}
