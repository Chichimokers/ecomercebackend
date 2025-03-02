import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrderEntity } from "./order.entity";
import { ProductEntity } from "../../products/entity/product.entity";
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity({ name: 'tb_order_products' })
export class OrderProductEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @ManyToOne(() => OrderEntity, (order) => order)
    order: OrderEntity;
  
    @ManyToOne(() => ProductEntity, (product) => product)
    product: ProductEntity;

    @Column()
    quantity: number;
}