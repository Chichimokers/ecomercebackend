import { Injectable } from "@nestjs/common";
import { BaseService } from "../../../common/services/base.service";
import { CategoryEntity } from "../entity/category.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class CategoryService extends BaseService<CategoryEntity>{
    protected getRepositoryName(): string {
        return "tb_category";
    }

    constructor(
        @InjectRepository(CategoryEntity)
        private readonly categoryRepository: Repository<CategoryEntity>,
    ) {
        super(categoryRepository);
    }


}