import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocapiBuilder } from './swagger';

async function bootstrap() {


  const app = await NestFactory.create(AppModule);


  DocapiBuilder(app);
  
  await app.listen(3000);

  console.log("Escuchando en puerto 3000")

}
bootstrap();
