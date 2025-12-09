import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ApiKeysService } from '../../api-keys/api-keys.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private apiKeysService: ApiKeysService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const key = request.headers['x-api-key'];

    if (!key) {
      return true; // Pass to next guard (JWT) or fail if no other guard
    }

    const apiKey = await this.apiKeysService.validateKey(key);
    if (!apiKey) {
      throw new UnauthorizedException('Invalid or expired API Key');
    }

    request.apiKey = apiKey; // Attach key info to request
    return true;
  }
}
