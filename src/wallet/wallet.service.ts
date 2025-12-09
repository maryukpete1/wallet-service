import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ClientSession } from 'mongoose';
import { Wallet, WalletDocument } from './schemas/wallet.schema';
import { Transaction, TransactionDocument } from './schemas/transaction.schema';
import { PaystackService } from './paystack.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class WalletService {
  private readonly logger = new Logger(WalletService.name);

  constructor(
    @InjectModel(Wallet.name) private walletModel: Model<WalletDocument>,
    @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
    private paystackService: PaystackService,
    private usersService: UsersService,
  ) {}

  async createWallet(userId: string) {
    // Check if wallet exists
    const existing = await this.walletModel.findOne({ userId });
    if (existing) return existing;

    const walletNumber = Date.now().toString().slice(-10) + Math.floor(Math.random() * 100);
    const wallet = new this.walletModel({
      userId,
      walletNumber,
    });
    return wallet.save();
  }

  async getBalance(userId: string) {
    const wallet = await this.walletModel.findOne({ userId });
    if (!wallet) throw new NotFoundException('Wallet not found');
    return { balance: wallet.balance, currency: wallet.currency };
  }

  async deposit(userId: string, amount: number) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const initData = await this.paystackService.initializeTransaction(user.email, amount);
    
    // Create a pending transaction
    const wallet = await this.walletModel.findOne({ userId });
    if (!wallet) throw new NotFoundException('Wallet not found');

    await this.transactionModel.create({
      walletId: wallet._id,
      type: 'deposit',
      amount,
      reference: initData.reference,
      status: 'pending',
      metadata: { paystackUrl: initData.authorization_url },
    });

    return initData;
  }

  async handleWebhook(signature: string, body: any) {
    if (!this.paystackService.verifyWebhookSignature(signature, body)) {
      throw new BadRequestException('Invalid signature');
    }

    const event = body.event;
    const data = body.data;

    if (event === 'charge.success') {
      const reference = data.reference;
      const transaction = await this.transactionModel.findOne({ reference });

      if (!transaction) {
        this.logger.warn(`Transaction with reference ${reference} not found`);
        return;
      }

      if (transaction.status === 'success') {
        this.logger.log(`Transaction ${reference} already processed`);
        return;
      }

      // Verify amount matches (Paystack returns kobo)
      const amountPaid = data.amount / 100;
      if (amountPaid !== transaction.amount) {
         this.logger.error(`Amount mismatch: expected ${transaction.amount}, got ${amountPaid}`);
         transaction.status = 'failed';
         transaction.metadata = { ...(transaction.metadata as any), failureReason: 'Amount mismatch' };
         await transaction.save();
         return;
      }

      const session = await this.walletModel.db.startSession();
      session.startTransaction();
      try {
        transaction.status = 'success';
        await transaction.save({ session });

        await this.walletModel.updateOne(
          { _id: transaction.walletId },
          { $inc: { balance: amountPaid } },
        ).session(session);

        await session.commitTransaction();
      } catch (e) {
        await session.abortTransaction();
        this.logger.error('Failed to credit wallet', e);
        throw e;
      } finally {
        session.endSession();
      }
    }
  }

  async transfer(senderId: string, recipientWalletNumber: string, amount: number) {
    const senderWallet = await this.walletModel.findOne({ userId: senderId });
    if (!senderWallet) throw new NotFoundException('Sender wallet not found');

    if (senderWallet.balance < amount) {
      throw new BadRequestException('Insufficient balance');
    }

    const recipientWallet = await this.walletModel.findOne({ walletNumber: recipientWalletNumber });
    if (!recipientWallet) throw new NotFoundException('Recipient wallet not found');

    if (senderWallet.walletNumber === recipientWalletNumber) {
        throw new BadRequestException('Cannot transfer to self');
    }

    const session = await this.walletModel.db.startSession();
    session.startTransaction();
    try {
      // Deduct from sender
      await this.walletModel.updateOne(
        { _id: senderWallet._id },
        { $inc: { balance: -amount } },
      ).session(session);

      // Add to recipient
      await this.walletModel.updateOne(
        { _id: recipientWallet._id },
        { $inc: { balance: amount } },
      ).session(session);

      // Record transactions
      await this.transactionModel.create([{
        walletId: senderWallet._id,
        type: 'transfer_out',
        amount,
        status: 'success',
        reference: `trf_${Date.now()}_out`,
        metadata: { recipient: recipientWalletNumber },
      }], { session });

      await this.transactionModel.create([{
        walletId: recipientWallet._id,
        type: 'transfer_in',
        amount,
        status: 'success',
        reference: `trf_${Date.now()}_in`,
        metadata: { sender: senderWallet.walletNumber },
      }], { session });

      await session.commitTransaction();
      return { status: 'success', message: 'Transfer completed' };
    } catch (e) {
      await session.abortTransaction();
      throw e;
    } finally {
      session.endSession();
    }
  }

  async getTransactions(userId: string) {
    const wallet = await this.walletModel.findOne({ userId });
    if (!wallet) throw new NotFoundException('Wallet not found');
    return this.transactionModel.find({ walletId: wallet._id }).sort({ createdAt: -1 }).exec();
  }
}
