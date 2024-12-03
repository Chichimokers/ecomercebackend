import { IsBoolean, IsPositive } from "class-validator";
import { BaseEntity } from 'src/common/entities/base.entity';
import { OrderEntity } from 'src/subsystems/orders/entities/order.entity';
import { ProductEntity } from 'src/subsystems/products/entity/product.entity';
import { User } from 'src/subsystems/user/entities/user.entity';

import {
    Check,
    Column,
    Entity,
    ManyToOne
} from "typeorm";


@Entity({ name: 'tb_cart' })
@Check(`"total" >= 0`)
@Check(`"quantity" >= 0`)
export class CartEntity extends BaseEntity  {
    @Column()
    @IsPositive()
    total: number;
  
    @Column()
    @IsPositive()
    quantity: number;
    
    @ManyToOne((): typeof OrderEntity => OrderEntity, (order: OrderEntity): CartEntity[] => order.carts, { nullable: true })
    order: OrderEntity;

    @ManyToOne((): typeof  ProductEntity => ProductEntity, (product: ProductEntity): CartEntity[] => product.cart)
    item: ProductEntity;
  
    @ManyToOne((): typeof User => User, (user: User): number => user.id)
    user: User;

    @IsBoolean()
    @Column({ type: 'boolean', default: false })
    paid: boolean;
}
