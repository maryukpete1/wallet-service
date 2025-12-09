import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const { user, apiKey } = request;

    // If user is logged in via JWT, they have full access (or we can define user roles later)
    // Requirement: "JWT users can perform all wallet actions."
    if (user) {
      return true;
    }

    // If accessed via API Key
    if (apiKey) {
      const hasPermission = requiredPermissions.some((permission) =>
        apiKey.permissions.includes(permission),
      );
      if (!hasPermission) {
        throw new ForbiddenException('API Key does not have the required permissions');
      }
      return true;
    }

    throw new UnauthorizedException('No authentication provided');
  }
}
