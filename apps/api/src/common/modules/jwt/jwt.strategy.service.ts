import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { Request } from 'express';
import { env } from '@tooling/env/server';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    const jwtSecret = env.JWT_SECRET;

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request.cookies?.access_token,
      ]),

      secretOrKey: jwtSecret,
    });
  }

  validate(payload: { sub: number }) {
    console.log('validation sub', payload.sub);
    return this.userService.findUnique({ where: { id: payload.sub } });
  }
}
