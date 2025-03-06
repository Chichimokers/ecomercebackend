import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class SearchproductDTO {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsUUID()
    province?: string;
}