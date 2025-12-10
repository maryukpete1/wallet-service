import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ApiKey, ApiKeyDocument } from './schemas/api-key.schema';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ApiKeysService {
  constructor(@InjectModel(ApiKey.name) private apiKeyModel: Model<ApiKeyDocument>) {}

  async create(userId: string, name: string, permissions: string[], expiry: string) {
    const activeKeysCount = await this.apiKeyModel.countDocuments({
      userId,
      isRevoked: false,
      expiresAt: { $gt: new Date() },
    });

    if (activeKeysCount >= 5) {
      throw new BadRequestException('Maximum of 5 active API keys allowed per user.');
    }

    const key = `sk_live_${crypto.randomBytes(24).toString('hex')}`;
    const hashedKey = await bcrypt.hash(key, 10);
    const expiresAt = this.calculateExpiry(expiry);

    const apiKey = new this.apiKeyModel({
      userId,
      key: hashedKey,
      name,
      permissions,
      expiresAt,
    });

    await apiKey.save();
    return { api_key: key, expires_at: expiresAt };
  }

  async rollover(userId: string, expiredKeyId: string, expiry: string) {
    const oldKey = await this.apiKeyModel.findOne({ _id: expiredKeyId, userId });
    if (!oldKey) {
      throw new NotFoundException('API Key not found.');
    }

    if (oldKey.expiresAt > new Date()) {
      throw new BadRequestException('Key is not yet expired.');
    }

    return this.create(userId, oldKey.name, oldKey.permissions, expiry);
  }

  async validateKey(key: string) {
    const allKeys = await this.apiKeyModel.find({ isRevoked: false });
    
    for (const apiKey of allKeys) {
        const isMatch = await bcrypt.compare(key, apiKey.key);
        if (isMatch) {
            if (apiKey.expiresAt < new Date()) {
                return null;
            }
            apiKey.lastUsedAt = new Date();
            await apiKey.save();
            return apiKey;
        }
    }
    return null;
  }

  private calculateExpiry(expiry: string): Date {
    const now = new Date();
    const amount = parseInt(expiry.slice(0, -1));
    const unit = expiry.slice(-1).toUpperCase();

    switch (unit) {
      case 'H':
        now.setHours(now.getHours() + amount);
        break;
      case 'D':
        now.setDate(now.getDate() + amount);
        break;
      case 'M':
        now.setMonth(now.getMonth() + amount);
        break;
      case 'Y':
        now.setFullYear(now.getFullYear() + amount);
        break;
      default:
        throw new BadRequestException('Invalid expiry format. Use 1H, 1D, 1M, 1Y.');
    }
    return now;
  }
}
