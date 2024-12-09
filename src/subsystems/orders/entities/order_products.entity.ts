import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrderEntity } from "./order.entity";
import { ProductEntity } from "../../products/entity/product.entity";

@Entity({ name: 'tb_order_products' })
export class OrderProductEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => OrderEntity, (order) => order)
    order: OrderEntity;
  
    @ManyToOne(() => ProductEntity, (product) => product)
    product: ProductEntity;

    @Column()
    quantity: number;
}