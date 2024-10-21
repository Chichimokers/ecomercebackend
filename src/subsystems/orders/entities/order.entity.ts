import { IsNumber, IsString } from 'class-validator';
import { BaseEntity } from 'src/common/entities/base.entity';
import { ProductEntity } from 'src/subsystems/products/entity/product.entity';
import { User } from 'src/subsystems/user/entities/user.entity';
import { CartEntity } from 'src/subsystems/cart/entity/cart.entity';
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

    @OneToOne(() => User, (user) => user.id)
    @JoinColumn()
    user: User;

    @Column()
    @IsString()
    phone :string

    @Column()
    @IsString()
    address :string

    @Column()
    @IsNumber()
    CI :number

    @Column()
    subTotal: number;
  
    @Column({ default: true })
    pending: boolean;

    @OneToMany(() => CartEntity, (cart) => cart.id)
    @JoinColumn()
    carts: CartEntity[];

  }
  