import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial, ObjectLiteral, FindOptionsWhere, FindOptionsOrder } from 'typeorm';
import { IBaseService } from '../interfaces/base-service.interface';
import { BaseEntity } from '../entities/base.entity';



/**
 * Clase abstracta BaseService que proporciona métodos comunes para el manejo de entidades.
 * 
 * @template BaseEntity - Tipo de la entidad que extiende ObjectLiteral.
 */
@Injectable()
export abstract class BaseService<BaseEntity extends ObjectLiteral> implements IBaseService<BaseEntity> {
    constructor(
        @InjectRepository(BaseEntity)
        protected readonly repository: Repository<BaseEntity>, // Repositorio de la entidad.
    ) { }

    /**
     * Método abstracto que debe ser implementado por las clases que extienden BaseService.
     * Devuelve el nombre del repositorio correspondiente.
     */
    protected abstract getRepositoryName(): string;

    async  findAll(): Promise<BaseEntity[]> {
        return this.repository.find(); // Retorna todas las entidades.
    }

    async findOneById(id: any): Promise<BaseEntity> {
        return this.repository.findOne({ where: { id, deleted_at: null } as FindOptionsWhere<BaseEntity> });
    }

    async create(dto: DeepPartial<BaseEntity>): Promise<BaseEntity> {
        const _obj = this.repository.create(dto);
        return this.repository.save(_obj);
    }

    async update(id: any, item: Partial<BaseEntity>): Promise<Partial<BaseEntity>> {
        await this.repository.update(id, item as Partial<BaseEntity>);
        return this.repository.findOne({ where: { id, deleted_at: null } as FindOptionsWhere<BaseEntity> });
    }

    async delete(id: number): Promise<{ affected?: number }> {
        return this.repository.delete(id);
    }

    async softDelete(id: number): Promise<void> {
        await this.repository.softDelete(id);
    }
}
