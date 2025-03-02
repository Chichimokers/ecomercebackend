import 'reflect-metadata'
import { DataSource } from 'typeorm'


export const PostgresDataSource = new DataSource({
    type: 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(`${process.env.POSTGRES_PORT || 5432}`),
    username: process.env.POSTGRES_USER || 'myuser',
    password: process.env.POSTGRES_PASSWORD || 'mypassword',
    database: process.env.POSTGRES_DATABASE || 'esaquishop',
    synchronize:  true,
    logging: false,
    migrationsRun: true,
    entities: [__dirname + '/**/*.entity{.ts,.js}'], // Busca todas las entidades
});

export const TestPostgresDataSource = new DataSource({
    type: 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(`${process.env.POSTGRES_PORT || 5432}`),
    username: process.env.POSTGRES_USER || 'myuser',
    password: process.env.POSTGRES_PASSWORD || 'mypassword',
    database: process.env.POSTGRES_DATABASE || 'esaquishop',
    migrationsRun: true,
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
})




