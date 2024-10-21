import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { join } from 'path';


export const PostgresDataSource = new DataSource({
    type: 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(`${process.env.POSTGRES_PORT || 5432}`),
    username: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || '018900149913',
    database: process.env.POSTGRES_DATABASE || 'esaqui',
    synchronize:  true,
    logging: true,
    migrationsRun: true,
    entities: [__dirname + '/**/*.entity{.ts,.js}'], // Busca todas las entidades
});




