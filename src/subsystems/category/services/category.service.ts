import { Injectable } from "@nestjs/common";
import { BaseService } from "../../../common/services/base.service";
import { CategoryEntity } from "../entity/category.entity";
import { In, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { IPagination } from "../../../common/interfaces/pagination.interface";

@Injectable()
export class CategoryService extends BaseService<CategoryEntity> {
    protected getRepositoryName(): string {
        return 'tb_category';
    }

    constructor(
        @InjectRepository(CategoryEntity)
        private readonly categoryRepository: Repository<CategoryEntity>,
    ) {
        super(categoryRepository);
    }

    override async findAll(pagination: IPagination){
        return await this.categoryRepository.find({
            relations: ['subCategories'],
            skip: pagination.page ? pagination.page * pagination.limit : undefined,
            take: pagination.limit ? pagination.limit : undefined,
        });
    }

    //          *--- Services for public's Endpoints ---*
    //      *--- Get Categories ---*
    public async getCategories() {
        const categories: CategoryEntity[] = await this.categoryRepository.find({
            relations: ['products'],
        });

        return categories
            .filter((category: CategoryEntity): boolean => category.products.length > 0)
            .map((category: CategoryEntity) => ({
                id: category.id,
                name: category.name,
            }));
    }
    //      *--- Get Categories with SubCategories ---*
    public async getCategoriesWithSubCategories(categoryIds?: string[]) {
        const whereConditions: any = {}

        if (categoryIds && categoryIds.length > 0) {
            whereConditions.category = { id: In(categoryIds) };
        }

        return await this.categoryRepository.find({
            relations: ['subCategories'],
            select: {
                id: true,
                name: true,
                subCategories: {
                    id: true,
                    name: true,
                },
            },
            where: whereConditions.category,
        });
    }

    public async countCategories(): Promise<number> {
        return await this.categoryRepository.count();
    }
}
