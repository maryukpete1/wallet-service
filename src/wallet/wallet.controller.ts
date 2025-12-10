import { Controller, Post, Get, Body, Req, UseGuards, Headers, Param } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CompositeAuthGuard } from '../auth/guards/composite-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiSecurity } from '@nestjs/swagger';
import { DepositDto } from './dto/deposit.dto';
import { TransferDto } from './dto/transfer.dto';

@ApiTags('Wallet')
@ApiSecurity('x-api-key')
@ApiBearerAuth()
@Controller('wallet')
export class WalletController {
  constructor(private walletService: WalletService) {}

  @Post('deposit')
  @UseGuards(CompositeAuthGuard, PermissionsGuard)
  @Permissions('deposit')
  @ApiOperation({ summary: 'Initialize a deposit' })
  @ApiResponse({ status: 201, description: 'Deposit initialized successfully.' })
  async deposit(@Req() req: any, @Body() body: DepositDto) {
    return this.walletService.deposit(req.user._id || req.user.userId, body.amount);
  }

  @Post('paystack/webhook')
  @ApiOperation({ summary: 'Paystack Webhook' })
  @ApiResponse({ status: 200, description: 'Webhook processed successfully.' })
  async webhook(@Headers('x-paystack-signature') signature: string, @Body() body: any) {
    return this.walletService.handleWebhook(signature, body);
  }

  @Get('balance')
  @UseGuards(CompositeAuthGuard, PermissionsGuard)
  @Permissions('read')
  @ApiOperation({ summary: 'Get wallet balance' })
  @ApiResponse({ status: 200, description: 'Returns the current balance.' })
  async getBalance(@Req() req: any) {
    return this.walletService.getBalance(req.user._id || req.user.userId);
  }

  @Get('transactions')
  @UseGuards(CompositeAuthGuard, PermissionsGuard)
  @Permissions('read')
  @ApiOperation({ summary: 'Get transaction history' })
  @ApiResponse({ status: 200, description: 'Returns the list of transactions.' })
  async getTransactions(@Req() req: any) {
    return this.walletService.getTransactions(req.user._id || req.user.userId);
  }

  @Post('transfer')
  @UseGuards(CompositeAuthGuard, PermissionsGuard)
  @Permissions('transfer')
  @ApiOperation({ summary: 'Transfer funds to another wallet' })
  @ApiResponse({ status: 201, description: 'Transfer successful.' })
  async transfer(@Req() req: any, @Body() body: TransferDto) {
    return this.walletService.transfer(req.user._id || req.user.userId, body.wallet_number, body.amount);
  }
  
  @Get('deposit/:reference/status')
  @UseGuards(CompositeAuthGuard, PermissionsGuard)
  @Permissions('read')
  @ApiOperation({ summary: 'Verify deposit status (Optional)' })
  async verifyStatus(@Param('reference') reference: string) {
      return { message: "Use webhook for status updates." };
  }
}
