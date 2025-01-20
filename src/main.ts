import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocapiBuilder } from './swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        origin: 'http://localhost:3000',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });

    DocapiBuilder(app);

    await app.listen(process.env.POSTGRES_HOST||  8000);

    //console.log("Escuchando en puerto 8000");

}
bootstrap().then(() => console.log("Server running on port 8000"));
