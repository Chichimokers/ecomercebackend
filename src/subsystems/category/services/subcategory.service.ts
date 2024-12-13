import { Injectable } from "@nestjs/common";
import { BaseService } from "../../../common/services/base.service";
import { SubCategoryEntity } from "../entity/category.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class SubCategoryService extends BaseService<SubCategoryEntity>{
    protected getRepositoryName(): string {
        return "tb_subcategory";
    }

    constructor(
        @InjectRepository(SubCategoryEntity)
        private readonly subCategoryRepository: Repository<SubCategoryEntity>,
    ) {
        super(subCategoryRepository);
    }


}