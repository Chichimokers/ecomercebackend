import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocapiBuilder } from './swagger';
import { appendFile } from 'fs';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        origin: 'http://localhost:3000',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });

    DocapiBuilder(app);

    await app.listen(process.env.APP_PORT||  8000);

    //console.log("Escuchando en puerto 8000");

}
bootstrap().then(() => console.log("Server running on port " + process.env.APP_PORT||  8000));
