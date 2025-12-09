import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type ApiKeyDocument = ApiKey & Document;

@Schema({ timestamps: true })
export class ApiKey {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: User;

  @Prop({ required: true, unique: true })
  key: string; // Hashed key

  @Prop({ required: true })
  name: string;

  @Prop({ type: [String], required: true })
  permissions: string[];

  @Prop({ required: true })
  expiresAt: Date;

  @Prop({ default: false })
  isRevoked: boolean;

  @Prop()
  lastUsedAt: Date;
}

export const ApiKeySchema = SchemaFactory.createForClass(ApiKey);
