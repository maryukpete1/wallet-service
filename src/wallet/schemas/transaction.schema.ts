import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Wallet } from './wallet.schema';

export type TransactionDocument = Transaction & Document;

@Schema({ timestamps: true })
export class Transaction {
  @Prop({ type: Types.ObjectId, ref: 'Wallet', required: true })
  walletId: Wallet;

  @Prop({ required: true, enum: ['deposit', 'transfer_in', 'transfer_out'] })
  type: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ unique: true, sparse: true })
  reference: string; // Paystack reference or internal ID

  @Prop({ required: true, enum: ['pending', 'success', 'failed'] })
  status: string;

  @Prop({ type: Object })
  metadata: any; // Store sender/receiver details
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
