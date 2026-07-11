import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../jwt/jwt.strategy.service';
import { AuthCookieService } from './auth-cookie.service';
import { env } from '@tooling/env/server';
import { UserService } from 'src/user/user.service';

const EXPIRES_IN = '7d';

@Module({
  imports: [
    PassportModule,

    JwtModule.register({
      secret: env.JWT_SECRET,
      signOptions: {
        expiresIn: EXPIRES_IN,
      },
    }),
  ],
  providers: [AuthService, AuthCookieService, JwtStrategy, UserService],
  exports: [AuthService, AuthCookieService, JwtStrategy],
})
export class AuthModule {}
