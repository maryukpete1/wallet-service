import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Min } from 'class-validator';

export class TransferDto {
  @ApiProperty({ example: '1234567890', description: 'Recipient wallet number' })
  @IsString()
  wallet_number: string;

  @ApiProperty({ example: 1000, description: 'Amount to transfer' })
  @IsNumber()
  @Min(1)
  amount: number;
}
