import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocapiBuilder } from './swagger';
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    //app.useGlobalPipes(new ValidationPipe());
    app.enableCors({
        origin: getOrigins(),
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    });

    DocapiBuilder(app);

    await app.listen(process.env.APP_PORT || 3100);

    //console.log("Escuchando en puerto 8000");
}
bootstrap().then(() =>
    console.log('Server running on port ' + process.env.APP_PORT || 3100),
);

function getOrigins() {
    if(process.env.DEBUG === 'true') {
        return ['http://localhost:3000', 'https://esaki-jrr.com']
    }

    return ['https://esaki-jrr.com']
}
