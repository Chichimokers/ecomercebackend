import { Injectable, NestInterceptor, ExecutionContext, CallHandler, BadRequestException } from "@nestjs/common";
import { Observable, from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import * as sharp from 'sharp';
import * as path from 'path';
import { promises as fs } from 'fs';

@Injectable()
export class WebpInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();

        if (request.file) {
            const { buffer, mimetype } = request.file;

            // Función que convierte y guarda la imagen
            const processImage = async () => {
                // Generar un nombre único para el archivo
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const newFileName = uniqueSuffix + '.webp';
                // Define la ruta de destino (ajusta el path según tu proyecto)
                const destination = path.join('./public/images', newFileName);

                try {
                    // Si la imagen no es WebP, la convierte
                    const outputBuffer =
                        mimetype !== 'image/webp'
                            ? await sharp(buffer).webp().toBuffer()
                            : buffer;

                    // Guarda el archivo convertido en disco
                    await fs.writeFile(destination, outputBuffer);

                    // Actualiza las propiedades del archivo en la request
                    request.file.buffer = outputBuffer;
                    request.file.filename = process.env.IMAGES + 'images/' + newFileName;
                    request.file.mimetype = 'image/webp';
                } catch (error) {
                    console.error('Error al convertir la imagen');

                    throw new BadRequestException(
                        'La imagen proporcionada no es valida o tiene un formato no soportado'
                    );
                }
            };

            // Convertimos la promesa en un Observable y continuamos con la ejecución
            return from(processImage()).pipe(mergeMap(() => next.handle()));
        }

        return next.handle();
    }
}
