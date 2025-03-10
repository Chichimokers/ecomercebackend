import { IsOptional, IsUUID } from "class-validator";

export class BaseDto {
    @IsOptional()
    @IsUUID()
    id?: string; // Si es necesario tener un ID en el DTO base
}
