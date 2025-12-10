import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsEnum } from 'class-validator';

export class CreateApiKeyDto {
  @ApiProperty({ example: 'My Service Key', description: 'Name of the API key' })
  @IsString()
  name: string;

  @ApiProperty({ example: ['deposit', 'transfer', 'read'], description: 'List of permissions' })
  @IsArray()
  @IsString({ each: true })
  permissions: string[];

  @ApiProperty({ example: '30d', description: 'Expiration time (e.g., 30d, 1y)' })
  @IsString()
  expiry: string;
}
