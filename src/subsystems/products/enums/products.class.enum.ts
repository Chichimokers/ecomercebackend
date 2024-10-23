import { ApiProperty } from '@nestjs/swagger';

export enum ProductClass {
    Ropa = 1,
    Zapatos = 2,
    Electrodomesticos = 3,
    Hogar = 4,
    PC = 5,
}

// Documentar el enum como un todo
export const ProductClassDocumentation = {
    Ropa: { example: 1, description: 'Ropa' },
    Zapatos: { example: 2, description: 'Zapatos' },
    Electrodomesticos: { example: 3, description: 'Electrodomesticos' },
    Hogar: { example: 4, description: 'Hogar' },
    PC: { example: 5, description: 'PC' },
};
