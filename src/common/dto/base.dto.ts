import { IsOptional } from 'class-validator';

export class BaseDto {
    @IsOptional()
    id?: string; // Si es necesario tener un ID en el DTO base
}
