import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RolloverApiKeyDto {
  @ApiProperty({ example: '60d21b4667d0d8992e610c85', description: 'ID of the expired key' })
  @IsString()
  expired_key_id: string;

  @ApiProperty({ example: '30d', description: 'New expiration time' })
  @IsString()
  expiry: string;
}
