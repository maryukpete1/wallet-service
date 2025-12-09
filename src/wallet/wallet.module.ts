import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Wallet, WalletSchema } from './schemas/wallet.schema';
import { Transaction, TransactionSchema } from './schemas/transaction.schema';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { PaystackService } from './paystack.service';
import { ApiKeysModule } from '../api-keys/api-keys.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Wallet.name, schema: WalletSchema },
      { name: Transaction.name, schema: TransactionSchema },
    ]),
    ApiKeysModule,
    UsersModule,
  ],
  providers: [WalletService, PaystackService],
  controllers: [WalletController],
  exports: [WalletService],
})
export class WalletModule {}
