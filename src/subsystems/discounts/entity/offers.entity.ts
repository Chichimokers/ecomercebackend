import { Column, Entity, OneToOne } from "typeorm";
import { BaseEntity } from "../../../common/entities/base.entity";
import { ProductEntity } from "../../products/entity/product.entity";

@Entity({ name: "tb_offer" })
export class OfferEntity extends BaseEntity {
    @Column()
    percentage: number;

    @Column()
    description: string;

    @Column()
    expire_at: Date;

    @OneToOne(() => ProductEntity, (product) => product.offers)
    products: ProductEntity;
}