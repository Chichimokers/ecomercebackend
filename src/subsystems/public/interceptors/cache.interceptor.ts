import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Cache } from '@nestjs/cache-manager';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CACHE_ORM } from '../../../common/constants/cahetimesORM.constants';

@Injectable()
export class PublicCacheInterceptor implements NestInterceptor {
    private excludedPaths: string[] = [
        '/public/currency',
    ];

    constructor(@Inject(Cache) private cacheManager: Cache) {}

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        // Solo interceptar peticiones GET
        const request = context.switchToHttp().getRequest();
        if (request.method !== 'GET') {
            return next.handle();
        }

        const currentPath = request.url.split('?')[0]; // Quita los parámetros de consulta
        if (this.excludedPaths.some(path => currentPath.startsWith(path))) {
            return next.handle(); // No aplicar caché para rutas excluidas
        }

        // Crear una clave de caché basada en la URL y los parámetros
        const cacheKey = `${request.url}${JSON.stringify(request.query)}`;

        // Intentar obtener datos de caché
        const cachedData = await this.cacheManager.get(cacheKey);
        if (cachedData) {
            return of(cachedData);
        }

        // Definir tiempos de caché según la URL
        let ttl = CACHE_ORM.TEN_MINUTES; // Por defecto, 10 minutos

        if (request.url.includes('/public/home')) {
            ttl = CACHE_ORM.HOUR; // Caché de 1 hora para la página principal
        } else if (request.url.includes('/public/categories')) {
            ttl = CACHE_ORM.DAY; // Caché de 1 día para categorías
        } else if (request.url.includes('/public/provinces')) {
            ttl = CACHE_ORM.DAY; // Caché de 1 día para provincias
        } else if (request.url.includes('/public/product-details')) {
            ttl = CACHE_ORM.HOUR * 2; // Caché de 2 horas para detalles de producto
        }

        // Continuar con la ejecución y guardar resultado en caché
        return next.handle().pipe(
            tap(async (responseData) => {
                if (responseData) {
                    await this.cacheManager.set(cacheKey, responseData, ttl);
                }
            })
        );
    }
}