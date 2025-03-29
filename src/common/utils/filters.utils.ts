import { IFilterProduct } from "../interfaces/filters.interface";
import { Between, In, MoreThanOrEqual, Not, MoreThan } from "typeorm";

export function applyFilter(filters: IFilterProduct) {
    const whereConditions: any = {}

    whereConditions.deleted_at = null;

    if (filters.categoryIds && filters.categoryIds.length > 0) {
        whereConditions.category = { id: In(filters.categoryIds) };
    }

    if (filters.subCategoryIds && filters.subCategoryIds.length > 0) {
        whereConditions.subCategory = { id: In(filters.subCategoryIds) };
    }

    if (filters.prices && filters.prices.length === 2) {
        whereConditions.price = Between(filters.prices[0], filters.prices[1]);
    }

    if (filters.rate) {
        whereConditions.ratings = { rate: MoreThanOrEqual(filters.rate) };
    }

    if (filters.id) {
        whereConditions.id = filters.id;
    }

    if (filters.notId){
        whereConditions.id = Not(filters.notId);
    }

    if (filters.provinceId) {
        whereConditions.province = { id: filters.provinceId };
    }

    whereConditions.quantity = MoreThan(0);

    return whereConditions;
}

export function applyQueryFilters(query: any, filters: IFilterProduct) {
    query.where('product.deleted_at IS NULL');

    if (filters) {
        if (filters.id) {
            query.andWhere('product.id = :id', { id: filters.id });
        }

        if (filters.notId) {
            query.andWhere('product.id != :notId', { notId: filters.notId });
        }

        if (filters.categoryIds?.length) {
            query.andWhere('category.id IN (:...categoryIds)', {
                categoryIds: filters.categoryIds
            });
        }

        if (filters.subCategoryIds?.length) {
            query.andWhere('subCategory.id IN (:...subCategoryIds)', {
                subCategoryIds: filters.subCategoryIds
            });
        }

        if (filters.provinceId) {
            query.andWhere('province.id = :provinceId', { provinceId: filters.provinceId });
        }
    }
}