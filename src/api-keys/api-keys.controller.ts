import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiKeysService } from './api-keys.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateApiKeyDto } from './dto/create-api-key.dto';
import { RolloverApiKeyDto } from './dto/rollover-api-key.dto';

@ApiTags('API Keys')
@ApiBearerAuth()
@Controller('keys')
@UseGuards(JwtAuthGuard)
export class ApiKeysController {
  constructor(private apiKeysService: ApiKeysService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new API key' })
  @ApiResponse({ status: 201, description: 'The API key has been successfully created.' })
  async create(@Req() req: any, @Body() body: CreateApiKeyDto) {
    return this.apiKeysService.create(req.user.userId, body.name, body.permissions, body.expiry);
  }

  @Post('rollover')
  @ApiOperation({ summary: 'Rollover an expired API key' })
  @ApiResponse({ status: 201, description: 'The API key has been successfully rolled over.' })
  async rollover(@Req() req: any, @Body() body: RolloverApiKeyDto) {
    return this.apiKeysService.rollover(req.user.userId, body.expired_key_id, body.expiry);
  }
}
