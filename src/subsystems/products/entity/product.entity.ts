import { BaseEntity } from 'src/common/entities/base.entity';
import { CartEntity } from 'src/subsystems/cart/entity/cart.entity';
import {
    Entity,
    JoinColumn,
    OneToMany,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    PrimaryGeneratedColumn,
    
  } from 'typeorm';

  
  @Entity({ name:"tb_products"})
  export class ProductEntity extends BaseEntity {

  
    @Column()
    name: string;
  
    @Column()
    price: number;
  
    @Column()
    quantity: string;
  
    @CreateDateColumn()
    createdAt: string;
  
    @UpdateDateColumn()
    updtedAt: string;
  
    @OneToMany(() => CartEntity, (cart) => cart.id)
    @JoinColumn()
    cart: CartEntity[];
    
  }
  