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
    synchronize:  true,
    logging: true,
    migrationsRun: true,
    entities: [__dirname + '/**/*.entity{.ts,.js}'], // Busca todas las entidades
});




