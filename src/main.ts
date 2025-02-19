import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocapiBuilder } from './swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        origin: ['http://localhost:3000', 'https://esaki-jrr.com'],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    });

    DocapiBuilder(app);

    await app.listen(process.env.APP_PORT || 8080);

    //console.log("Escuchando en puerto 8000");
}
bootstrap().then(() =>
    console.log('Server running on port ' + process.env.APP_PORT || 8080),
);
