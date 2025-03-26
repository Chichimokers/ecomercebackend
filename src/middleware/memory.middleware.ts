import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

// Función para formatear bytes a B, KB, MB, GB, etc.
function formatBytes(bytes: number, decimals = 2): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

@Injectable()
export class MemoryUsageMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const memoryUsage = process.memoryUsage();
        const formattedMemoryUsage = {
            rss: formatBytes(memoryUsage.rss),
            heapTotal: formatBytes(memoryUsage.heapTotal),
            heapUsed: formatBytes(memoryUsage.heapUsed),
            external: formatBytes(memoryUsage.external),
            
            arrayBuffers: formatBytes(memoryUsage.arrayBuffers),
        };
        console.log('Uso de memoria:', formattedMemoryUsage);
        next();
    }
}
