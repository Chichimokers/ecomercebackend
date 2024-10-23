import { IsBoolean, isBoolean } from 'class-validator';
import { BaseEntity } from 'src/common/entities/base.entity';
import { OrderEntity } from 'src/subsystems/orders/entities/order.entity';
import { ProductEntity } from 'src/subsystems/products/entity/product.entity';
import { User } from 'src/subsystems/user/entities/user.entity';

import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';


@Entity({ name: 'tb_cart' })
export class CartEntity extends BaseEntity  {

    @Column()
    total: number;
  
    @Column()
    quantity: number;
    
    @ManyToOne(() => OrderEntity, (order) => order.id,{nullable : true})
    @JoinColumn()
    order: OrderEntity;

    @ManyToOne(() => ProductEntity, (product) => product.id)
    @JoinColumn()
    item: ProductEntity;
  
    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn()
    user: User;

    @IsBoolean()
    @Column({ type: 'boolean', default: false })
    paid: boolean;
}

