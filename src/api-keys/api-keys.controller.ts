import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiKeysService } from './api-keys.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('keys')
@UseGuards(JwtAuthGuard)
export class ApiKeysController {
  constructor(private apiKeysService: ApiKeysService) {}

  @Post('create')
  async create(@Req() req: any, @Body() body: { name: string; permissions: string[]; expiry: string }) {
    return this.apiKeysService.create(req.user.userId, body.name, body.permissions, body.expiry);
  }

  @Post('rollover')
  async rollover(@Req() req: any, @Body() body: { expired_key_id: string; expiry: string }) {
    return this.apiKeysService.rollover(req.user.userId, body.expired_key_id, body.expiry);
  }
}
