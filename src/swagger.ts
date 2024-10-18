import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

export const DocapiBuilder = (app)=>{
    

const config = new DocumentBuilder()
.setTitle('Ecommerce API Docs')
.setDescription("API e-commerce esaki")
.setVersion('v1')
.addBearerAuth()
.build();

const document = SwaggerModule.createDocument(app, config);

SwaggerModule.setup('api-docs', app, document);

}