import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocapiBuilder } from './swagger';
import { appendFile } from 'fs';
import * as fs from 'fs';
import * as https from 'https';

async function bootstrap() {
    const httpsOptions = {
        key: fs.readFileSync('src/certificates/priv.pem'), // Ruta al archivo de clave privada
        cert: fs.readFileSync('src/certificates/cert.pem'),   // Ruta al archivo del certificado
      };


    const app = await NestFactory.create(AppModule,{httpsOptions});



    app.enableCors({
        origin: 'http://localhost:3000',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });


    DocapiBuilder(app);

    await app.listen(process.env.APP_PORT||  8080);

    //console.log("Escuchando en puerto 8000");

}
bootstrap().then(() => console.log("Server running on port " + process.env.APP_PORT||  8080));
