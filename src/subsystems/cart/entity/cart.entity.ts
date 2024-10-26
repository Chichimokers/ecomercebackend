import { IsBoolean } from 'class-validator';
import { BaseEntity } from 'src/common/entities/base.entity';
import { OrderEntity } from 'src/subsystems/orders/entities/order.entity';
import { ProductEntity } from 'src/subsystems/products/entity/product.entity';
import { User } from 'src/subsystems/user/entities/user.entity';

import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';


@Entity({ name: 'tb_cart' })
export class CartEntity extends BaseEntity  {

    @Column()
    total: number;
  
    @Column()
    quantity: number;
    
    @ManyToOne(() => OrderEntity, (order) => order.carts, { nullable: true })
    order: OrderEntity;

    @ManyToOne(() => ProductEntity, (product) => product.cart)
    item: ProductEntity;
  
    @ManyToOne(() => User, (user) => user.id)
    user: User;

    @IsBoolean()
    @Column({ type: 'boolean', default: false })
    paid: boolean;
}
