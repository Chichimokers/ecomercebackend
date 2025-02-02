import { Injectable } from '@nestjs/common';
import { BaseService } from '../../../common/services/base.service';
import { CategoryEntity, SubCategoryEntity } from "../entity/category.entity";
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

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
        // Obtener todas las categorías con sus relaciones necesarias
        const categories: CategoryEntity[] = await this.categoryRepository.find({
            relations: ['subCategories', 'subCategories.products', 'products'],
        });

        // Mapear las categorías y filtrar las subcategorías según los IDs proporcionados
        return categories
            .filter((category: CategoryEntity): boolean => category.products && category.products.length > 0) // Categorías con productos
            .map((category: CategoryEntity) => ({
                id: category.id,
                name: category.name,
                subCategories: !categoryIds || categoryIds.includes(category.id) // Si no se proporcionan IDs, incluye todas las subcategorías
                    ? category.subCategories
                        .filter((subCategory: SubCategoryEntity): boolean => subCategory.products && subCategory.products.length > 0) // Subcategorías con productos
                        .map((subCategory: SubCategoryEntity) => ({
                            id: subCategory.id,
                            name: subCategory.name,
                        }))
                    : undefined, // Si la categoría no está en los IDs, subcategorías vacías
            }));
    }
}
