import { BaseEntity } from 'src/common/entities/base.entity';
import { CartEntity } from 'src/subsystems/cart/entity/cart.entity';
import { OrderEntity } from 'src/subsystems/orders/entities/order.entity';
import {
    Entity,
    JoinColumn,
    OneToMany,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    PrimaryGeneratedColumn,
    ManyToOne,
    
  } from 'typeorm';

  
  @Entity({ name:"tb_products"})
  export class ProductEntity extends BaseEntity {

    @Column({nullable: true})
    image: string;
    
    @Column()
    name: string;
  
    @Column()
    price: number;
  
    @Column()
    quantity: number;
    
    @OneToMany(() => CartEntity, (cart) => cart.id)
    @JoinColumn()
    cart: CartEntity[];
      
  }
  