import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "../../../common/entities/base.entity";
import { ProductEntity } from "../../products/entity/product.entity";
import { IsNotEmpty, IsString } from "class-validator";

@Entity({ name: "tb_category" })
export class CategoryEntity extends BaseEntity {
    @IsNotEmpty()
    @IsString()
    @Column({ length: 100 })
    name: string;

    @OneToMany(() => ProductEntity, product => product.category)
    products: ProductEntity[];

    @OneToMany(() => SubCategoryEntity, subCategory => subCategory.category, { onDelete: 'CASCADE'})
    subCategories: SubCategoryEntity[];
}

@Entity({name: "tb_subcategory"})
export class SubCategoryEntity extends BaseEntity {
    @IsNotEmpty()
    @IsString()
    @Column({ length: 100 })
    name: string;

    @ManyToOne(() => CategoryEntity, category => category.subCategories)
    category: CategoryEntity;

    @OneToMany(() => ProductEntity, product => product.subCategory)
    products: ProductEntity[];
}
