import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type WalletDocument = Wallet & Document;

@Schema({ timestamps: true })
export class Wallet {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  userId: User;

  @Prop({ required: true, unique: true })
  walletNumber: string;

  @Prop({ default: 0 })
  balance: number;

  @Prop({ default: 'NGN' })
  currency: string;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);
