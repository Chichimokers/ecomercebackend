import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ProductClassDocumentation } from './subsystems/products/enums/products.class.enum';

export const DocapiBuilder = (app)=> {
    const config = new DocumentBuilder()
        .setTitle('Ecommerce API Docs')
        .setDescription("API e-commerce esaki")
        .setVersion('v1')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config);

    // Aquí puedes agregar la documentación del enum
    document.components.schemas.ProductClass = {
        type: 'string',
        enum: Object.keys(ProductClassDocumentation), // Usar las claves del enum
        description: 'Clases de productos disponibles',
        example: Object.values(ProductClassDocumentation), // Ejemplo de la documentación
    };

    SwaggerModule.setup('api-docs', app, document);
}
