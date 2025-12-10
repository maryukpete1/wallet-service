import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ApiKeysService } from '../../api-keys/api-keys.service';

@Injectable()
export class CompositeAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly apiKeysService: ApiKeysService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];

    if (apiKey) {
      const validKey = await this.apiKeysService.validateKey(apiKey);
      if (validKey) {
        request.apiKey = validKey;
        request.user = { _id: validKey.userId, fromApiKey: true }; 
        return true;
      } else {
         throw new UnauthorizedException('Invalid API Key');
      }
    }

    const jwtGuard = new (AuthGuard('jwt'))();
    try {
        const canActivate = await jwtGuard.canActivate(context);
        if (canActivate) return true;
    } catch (e) {
        throw new UnauthorizedException('Unauthorized');
    }
    
    return false;
  }
}
