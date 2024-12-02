/*import { Column, Entity, OneToOne, Check } from "typeorm";
import { BaseEntity } from "../../../common/entities/base.entity";
import { ProductEntity } from "../../products/entity/product.entity";
import { IsPositive } from "class-validator";


@Entity({ name: "tb_offer" })
@Check(`"percentage" > 0 AND "percentage" <= 100`)
export class OfferEntity extends BaseEntity {
    @Column({ type: 'smallint' })
    @IsPositive()
    percentage: number;

    @Column()
    description: string;

    @Column()
    expire_at: Date;

    @OneToOne(() => ProductEntity, (product) => product.offers)
    products: ProductEntity;
}*/