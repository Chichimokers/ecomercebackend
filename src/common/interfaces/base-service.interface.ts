import { DeepPartial } from 'typeorm';


export interface IBaseService<BaseEntity> {

    findOneById(id: any): Promise<BaseEntity>;
    //findAll(paginationDto: PaginationQueryDto, dtoResponse: any): Promise<{ data: any[]; total: number; page: number; totalPages: number }>;
    findAll(): Promise<BaseEntity[]>; // Cambiado para no usar PaginateQuery.
    create(item: BaseEntity): Promise<BaseEntity>;
    update(id: any, item: Partial<BaseEntity>): Promise<Partial<BaseEntity>>;
    delete(id: any): Promise<{ affected?: number }>;
}
