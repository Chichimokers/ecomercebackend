import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { join } from 'path';


export const PostgresDataSource = new DataSource({
    type: 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(`${process.env.POSTGRES_PORT || 5432}`),
    username: process.env.POSTGRES_USER || 'myuser',
    password: process.env.POSTGRES_PASSWORD || 'mypassword',
    database: process.env.POSTGRES_DATABASE || 'esaquishop',
    synchronize: process.env.SYNCHRONIZE_DB === 'true',
    logging: false,
    entities: [join(__dirname, 'src', '**', 'entities', '*.{ts,js}')], // Busca todas las entidades
    migrations: [join(__dirname, 'src', '**', 'migrations', '*.{ts,js}')],
    subscribers: [join(__dirname, 'src', '**', 'subscribers', '*.{ts,js}')] // Busca todos los subscribers
});




