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

    //          *--- Services for public's Endpoints ---*
    //      *--- Get Categories with SubCategories ---*
    public async getCategoriesWithSubCategories() {
        const categories = await this.categoryRepository.find({
            relations: ['subCategories', 'subCategories.products', 'products']
        });

        return categories
            .filter(category => category.products.length > 0 || category.subCategories.some(subCategory => subCategory.products.length > 0))
            .map(category => ({
                id: category.id,
                name: category.name,
                subCategories: category.subCategories
                    .filter(subCategory => subCategory.products.length > 0)
                    .map(subCategory => ({
                        id: subCategory.id,
                        name: subCategory.name
                    }))
            }));
    }
}