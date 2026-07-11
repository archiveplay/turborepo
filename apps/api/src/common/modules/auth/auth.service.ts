import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { env } from '@tooling/env/server';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}
  async authenticateTelegram(initData: string) {
    console.log('start', initData, env.TELEGRAM_BOT_TOKEN);
    const params = new URLSearchParams(initData);

    const hash = params.get('hash');

    console.log('hash', hash);
    if (!hash) {
      throw new UnauthorizedException('Missing hash');
    }

    params.delete('hash');

    const dataCheckString = [...params.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    console.log('dataCheckString ', dataCheckString);

    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(env.TELEGRAM_BOT_TOKEN!)
      .digest();

    console.log('secretKey', secretKey);

    const calculatedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    console.log({
      dataCheckString,
      hash,
      calculatedHash,
    });

    if (calculatedHash !== hash) {
      throw new UnauthorizedException('Invalid Telegram signature');
    }

    const user = JSON.parse(params.get('user')!);

    // TODO:
    // find or create user in database

    return user;
  }

  async createToken(user: {
    id: string | number;
    telegramId: string | number;
  }) {
    return this.jwtService.signAsync({
      sub: user.id,
      telegramId: user.telegramId,
    });
  }
}
