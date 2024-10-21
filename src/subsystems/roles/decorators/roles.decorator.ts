// src/subsystems/roles/decorators/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { roles } from '../enum/roles.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: roles[]) => SetMetadata(ROLES_KEY, roles);