import { Injectable } from '@nestjs/common';
import { BaseService } from '../../../common/services/base.service';
import { CategoryEntity } from '../entity/category.entity';
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
        const categories = await this.categoryRepository.find({
            relations: ['products'],
        });

        return categories
            .filter((category) => category.products.length > 0)
            .map((category) => ({
                id: category.id,
                name: category.name,
            }));
    }
    //      *--- Get Categories with SubCategories ---*
    public async getCategoriesWithSubCategories(categoryIds: number[]) {
        // Obtener todas las categorías con sus relaciones necesarias
        const categories = await this.categoryRepository.find({
            relations: ['subCategories', 'subCategories.products', 'products'],
        });

        // Mapear las categorías y filtrar las subcategorías según los IDs proporcionados
        return categories.map((category) => ({
            id: category.id,
            name: category.name,
            subCategories: categoryIds.includes(category.id)
                ? category.subCategories.map((subCategory) => ({
                      id: subCategory.id,
                      name: subCategory.name,
                  }))
                : undefined, // Si la categoría no está en los IDs, subcategorías vacías
        }));
    }
}
