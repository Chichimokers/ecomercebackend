import { BaseEntity } from 'src/common/entities/base.entity';
import { ProductEntity } from 'src/subsystems/products/entity/product.entity';
import { User } from 'src/subsystems/user/entities/user.entity';
import {
    Entity,
    OneToMany,
    JoinColumn,
    OneToOne,
    Column,
    PrimaryGeneratedColumn,
  } from 'typeorm';

  
  @Entity({name:"tb_orders"})
  export class OrderEntity  extends BaseEntity{
  
    @OneToMany(() => ProductEntity, (item) => item.id)
    items: ProductEntity[];
  
    @OneToOne(() => User, (user) => user.name)
    @JoinColumn()
    user: User;
  
    @Column()
    subTotal: number;
  
    @Column({ default: false })
    pending: boolean;
  }
  