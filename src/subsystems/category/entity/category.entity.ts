import { Entity } from "typeorm";
import { BaseEntity } from "../../../common/entities/base.entity";

@Entity({ name: "tb_category" })
export class CategoryEntity extends BaseEntity {

}