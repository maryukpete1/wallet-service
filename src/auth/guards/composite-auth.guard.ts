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

    // 1. Try API Key
    if (apiKey) {
      const validKey = await this.apiKeysService.validateKey(apiKey);
      if (validKey) {
        request.apiKey = validKey;
        // We need to fetch the user associated with this key to populate request.user for downstream logic
        // Or we handle request.apiKey separately.
        // Requirement: "treat as service".
        // But wallet operations need a user context (whose wallet?).
        // "A user can generate API keys... API keys can access wallet endpoints"
        // So the API key acts ON BEHALF of the user who created it.
        // So we should set request.user to the key's owner.
        // I need to fetch the user.
        // I'll update ApiKeyGuard to fetch user.
        request.user = { _id: validKey.userId, fromApiKey: true }; 
        return true;
      } else {
         throw new UnauthorizedException('Invalid API Key');
      }
    }

    // 2. Try JWT
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
