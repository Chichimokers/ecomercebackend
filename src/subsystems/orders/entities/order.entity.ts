import { BaseEntity } from "../../../common/entities/base.entity";
import { User } from '../../user/entities/user.entity';
import {
    Entity,
    Column,
    ManyToOne, Check, OneToMany
} from "typeorm";
import { OrderProductEntity } from "./order_products.entity";
import { OrderStatus } from "../enums/orderStatus.enum";
import { MunicipalityEntity } from '../../locations/entity/municipality.entity';

@Entity({name:"tb_orders"})
@Check(`"subtotal" >= 0`)
export class OrderEntity  extends BaseEntity{
    @ManyToOne((): typeof User => User, (user: User): string => user.id)
    user: User;

    @Column({ length: 70, nullable: false })
    receiver_name: string;

    @Column({ length: 25, nullable: false })
    phone :string;

    @Column({ length: 25, nullable: true })
    aux_phone: string;

    @Column({ length: 255 })
    address :string;

    @Column({ length: 20 })
    CI :string;

    @Column({ type: 'numeric', precision: 10, scale: 2 })
    subtotal: number;

    @Column({ type: 'numeric', precision: 10, scale: 2 })
    shipping_price: number;

    @Column({
        type: "enum",
        enum: OrderStatus,
        default: OrderStatus.Pending,
    })
    status: OrderStatus;

    @Column({length: 255, nullable: true, default: null})
    stripe_id: string;
    
    @OneToMany(() => OrderProductEntity, (orderItem) => orderItem.order)
    orderItems: OrderProductEntity[];

    @ManyToOne(() => MunicipalityEntity)
    municipality: MunicipalityEntity;
}
