import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { env } from '@tooling/env/server';
import { User } from 'src/common/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}
  async authenticateTelegram(initData: string) {
    const params = new URLSearchParams(initData);

    const hash = params.get('hash');

    if (!hash) {
      throw new UnauthorizedException('Missing hash');
    }

    params.delete('hash');

    const dataCheckString = [...params.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(env.TELEGRAM_BOT_TOKEN!)
      .digest();

    const calculatedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    if (calculatedHash !== hash) {
      throw new UnauthorizedException('Invalid Telegram signature');
    }

    const user = JSON.parse(params.get('user')!);

    return user as User;
  }

  async createToken(user: User) {
    return this.jwtService.signAsync({
      sub: user.id,
    });
  }
}
