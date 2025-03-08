export interface IRefineInterface {
    _start?: number;
    _end?: number;
}

export interface IProductsFilters {
    page: number;
    limit: number;
    categoryIds?: any;
    subCategoryIds?: any;
    prices?: any;
    rate?: number;
    province?: string;
}