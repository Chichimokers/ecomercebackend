import { BaseEntity } from 'src/common/entities/base.entity';
import { CartEntity } from 'src/subsystems/cart/entity/cart.entity';
import {
    Entity,
    OneToMany,
    Column
} from 'typeorm';
import { ProductClass } from '../enums/products.class.enum';

@Entity({ name:"tb_products"})
export class ProductEntity extends BaseEntity {

    @Column({nullable: true})
    image: string;

    @Column()
    name: string;

    @Column()
    price: number;

    @Column()
    description: string;

    @Column()
    shortDescription: string;

    @Column()
    class: ProductClass;

    @Column()
    quantity: number;

    @OneToMany(() => CartEntity, (cart) => cart.item)
    cart: CartEntity[];

}
  
