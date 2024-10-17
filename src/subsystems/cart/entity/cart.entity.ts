import { BaseEntity } from 'src/common/entities/base.entity';
import { ProductEntity } from 'src/subsystems/products/entity/product.entity';
import { User } from 'src/subsystems/user/entities/user.entity';

import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';


@Entity({ name: 'tb_cart' })
export class CartEntity extends BaseEntity  {

    @Column()
    total: number;
  
    @Column()
    quantity: number;
  
    @ManyToOne(() => ProductEntity, (order) => order.id)
    @JoinColumn()
    item: ProductEntity;
  
    @ManyToOne(() => User, (user) => user.name)
    @JoinColumn()
    user: User;

}

