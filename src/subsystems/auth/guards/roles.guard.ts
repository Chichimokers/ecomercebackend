import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from "../../roles/decorators/roles.decorator";
import { roles } from "../../roles/enum/roles.enum";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles: roles[] = this.reflector.get<roles[]>(ROLES_KEY, context.getHandler());
    
    // Si no hay roles requeridos, permite el acceso
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    console.log(user)
    // Verifica si el usuario existe y tiene un rol válido
    if (!user?.role) {
      throw new ForbiddenException('Usuario no autenticado o sin rol asignado');
    }

    // Comprueba si el rol del usuario está en los requeridos
    const hasRequiredRole = requiredRoles.includes(user.role);
    
    if (!hasRequiredRole) {
      throw new ForbiddenException(
        `Acceso denegado. Roles permitidos: ${requiredRoles.join(', ')}`,
      );
    }

    return true;
  }
}