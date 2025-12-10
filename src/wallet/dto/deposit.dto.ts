import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class DepositDto {
  @ApiProperty({ example: 5000, description: 'Amount to deposit' })
  @IsNumber()
  @Min(1)
  amount: number;
}
