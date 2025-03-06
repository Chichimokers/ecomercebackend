import { IFilterProduct } from "../interfaces/filters.interface";
import { Between, In, MoreThanOrEqual, Not } from "typeorm";

export function applyFilter(filters: IFilterProduct) {
    const whereConditions: any = {}

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

    return whereConditions;
}