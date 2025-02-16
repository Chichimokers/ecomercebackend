import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial, ObjectLiteral, FindOptionsWhere, BaseEntity } from 'typeorm';
import { IBaseService } from '../interfaces/base-service.interface';



/**
 * Clase abstracta BaseService que proporciona métodos comunes para el manejo de entidades.
 * 
 * @template BaseEntity - Tipo de la entidad que extiende ObjectLiteral.
 */
@Injectable()
export abstract class BaseService<BaseEntity extends ObjectLiteral> implements IBaseService<BaseEntity> {
    protected constructor(
        @InjectRepository(BaseEntity)
        protected readonly repository: Repository<BaseEntity>, // Repositorio de la entidad.
    ) { }

    /**
     * Método abstracto que debe ser implementado por las clases que extienden BaseService.
     * Devuelve el nombre del repositorio correspondiente.
     */
    protected abstract getRepositoryName(): string;

    async findAll(_start?: number, _end?: number): Promise<BaseEntity[]> {
        const take = _end ? Number(_end) - Number(_start) : undefined; // Cantidad de elementos por página
        const skip = _start ? Number(_start) : undefined; // Desde qué índice empezar

        return await this.repository.find({
            skip: skip,
            take: take,
        });
    }

    async findOneById(id: any): Promise<BaseEntity> {
        const entity: BaseEntity = await this.repository.findOne({ where: { id, deleted_at: null } as FindOptionsWhere<BaseEntity> });
        if (!entity) throw new NotFoundException('Not found this element');
        return entity;
    }

    async create(dto: DeepPartial<BaseEntity>): Promise<BaseEntity> {
        const _obj = this.repository.create(dto);
        return this.repository.save(_obj);
    }

    async update(id: any, item: Partial<BaseEntity>): Promise<Partial<BaseEntity>> {
        await this.repository.update(id, item as Partial<BaseEntity>);
        return this.repository.findOne({ where: { id, deleted_at: null } as FindOptionsWhere<BaseEntity> });
    }

    async delete(id: string): Promise<{ affected?: number }> {
        return this.repository.delete(id);
    }

    async softDelete(id: string): Promise<void> {
        await this.repository.softDelete(id);
    }
}
