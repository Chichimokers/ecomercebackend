import { IsString } from 'class-validator';
import { BaseEntity } from 'src/common/entities/base.entity';
import { User } from 'src/subsystems/user/entities/user.entity';
import { CartEntity } from 'src/subsystems/cart/entity/cart.entity';
import {
    Entity,
    OneToMany,
    Column,
    ManyToOne,
} from 'typeorm';

  
  @Entity({name:"tb_orders"})
  export class OrderEntity  extends BaseEntity{

    @ManyToOne(() => User, (user) => user.id)
    user: User;

    @Column()
    @IsString()
    phone :string

    @Column()
    @IsString()
    address :string

    @Column()
    @IsString()
    CI :string

    @Column()
    subTotal: number;
  
    @Column({ default: true })
    pending: boolean;

    @OneToMany(() => CartEntity, (cart) => cart.order)
    carts: CartEntity[];
  
  }
