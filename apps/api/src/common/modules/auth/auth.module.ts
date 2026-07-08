import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../jwt/jwt.strategy.service';
import { AuthCookieService } from './auth-cookie.service';

const EXPIRES_IN = '7d';

@Module({
  imports: [
    PassportModule,

    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: EXPIRES_IN,
      },
    }),
  ],
  providers: [AuthService, AuthCookieService, JwtStrategy],
  exports: [AuthService, AuthCookieService, JwtStrategy],
})
export class AuthModule {}
