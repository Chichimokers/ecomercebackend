// logging.middleware.ts
        import { Injectable, NestMiddleware } from '@nestjs/common';
        import { Request, Response, NextFunction } from 'express';

        @Injectable()
        export class LoggingMiddleware implements NestMiddleware {
            use(req: Request, res: Response, next: NextFunction) {
                const now = new Date();
                const formattedDate = now.toLocaleString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true,
                });

                // Obtener la IP del cliente
                const clientIp =
                    req.headers['x-forwarded-for'] ?
                    (Array.isArray(req.headers['x-forwarded-for']) ?
                        req.headers['x-forwarded-for'][0] :
                        req.headers['x-forwarded-for'].split(',')[0]) :
                    req.ip || req.socket.remoteAddress;

                console.log(`[${res.statusCode}] - [${formattedDate}] IP: ${clientIp} LOG [${req.method}] ${req.originalUrl}`);
                next();
            }
        }