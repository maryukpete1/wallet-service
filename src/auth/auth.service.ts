import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { WalletService } from '../wallet/wallet.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private walletService: WalletService,
  ) {}

  async validateOAuthUser(details: {
    email: string;
    firstName: string;
    lastName: string;
    avatar: string;
    googleId: string;
  }) {
    const user = await this.usersService.findByEmail(details.email);
    if (user) {
      return user;
    }
    const newUser = await this.usersService.create(details);
    await this.walletService.createWallet(newUser._id.toString());
    return newUser;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

}
