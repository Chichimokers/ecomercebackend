import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from "../../roles/decorators/roles.decorator";
import { roles } from "../../roles/enum/roles.enum";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {
    }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles: roles[] = this.reflector.get<roles[]>(ROLES_KEY, context.getHandler());

        if (!requiredRoles) {
            return true; // Si no hay roles requeridos, permite el acceso
        }

        const request: any = context.switchToHttp().getRequest();
        console.log(request);
        const user: any = request.user; // Asegúrate de que el usuario esté disponible en la solicitud

        console.log(user);

        const hasRole  = (): boolean => user && requiredRoles.includes(user.role);
        if (!hasRole()) {
            throw new ForbiddenException('you dont have permission to access to this resource');
        }
        return true;
    }
}