import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { Request } from 'express';
import { env } from '@tooling/env/server';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prismaService: PrismaService) {
    const jwtSecret = env.JWT_SECRET;

    console.log('[jwt]: JwtStrategy created');

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request.cookies?.access_token,
      ]),

      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: { sub: number }) {
    console.log('[jwt]: validation sub', payload.sub);

    const user = await this.prismaService.client.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}
