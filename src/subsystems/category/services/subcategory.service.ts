import { BadRequestException, Injectable } from "@nestjs/common";
import { BaseService } from '../../../common/services/base.service';
import { CategoryEntity, SubCategoryEntity } from '../entity/category.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IServiceDTOC } from '../../../common/interfaces/base-service.interface';
import { UpdateSubCategoryDTO } from '../dto/subcategorydto/updateSubCategory.dto';
import { captureNotFoundException } from '../../../common/exceptions/modular.exception';
import { CreateSubCategoryDTO } from "../dto/subcategorydto/createSubCategory.dto";

@Injectable()
export class SubCategoryService
    extends BaseService<SubCategoryEntity>
    implements IServiceDTOC
{
    protected getRepositoryName(): string {
        return 'tb_subcategory';
    }

    constructor(
        @InjectRepository(SubCategoryEntity)
        private readonly subCategoryRepository: Repository<SubCategoryEntity>,
        @InjectRepository(CategoryEntity)
        private readonly categoryRepository: Repository<CategoryEntity>,
    ) {
        super(subCategoryRepository);
    }

    async insertByDTO(dto: CreateSubCategoryDTO) {
        // QueryFailedError
        const category: CategoryEntity = await this.categoryRepository.findOne({
            where: { id: dto.categoryId },
        });

        captureNotFoundException(category, 'Category');

        try {
            const subCategory: SubCategoryEntity = this.subCategoryRepository.create({
                name: dto.name,
                category: category,
            });

            return await this.subCategoryRepository.save(subCategory);
        } catch (QueryFailedError) {
            throw new BadRequestException('The name already exists');
        }
    }

    async updateByDTO(id: string, dto: UpdateSubCategoryDTO): Promise<Partial<SubCategoryEntity>> {
        const subcategory: SubCategoryEntity = await this.subCategoryRepository.findOne({
            where: { id },
        });

        captureNotFoundException(subcategory, 'SubCategory');

        ['name'].forEach((field: string): void => {
            if (dto[field] !== undefined) {
                subcategory[field] = dto[field];
            }
        });

        if (dto.categoryId) {
            const category: CategoryEntity = await this.categoryRepository.findOne({
                where: { id: dto.categoryId },
            });

            captureNotFoundException(category, `Refer Category`);

            subcategory.category = category;
        }

        subcategory.updated_at = new Date();

        return await this.subCategoryRepository.save(subcategory);
    }
}
