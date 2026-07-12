import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../jwt/jwt.strategy.service';
import { AuthCookieService } from './auth-cookie.service';
import { env } from '@tooling/env/server';
import { UserService } from 'src/user/user.service';
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guard';
import { PrismaModule } from '../prisma/prisma.module';

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

    PrismaModule,
  ],
  providers: [AuthService, AuthCookieService, JwtStrategy, JwtAuthGuard],
  exports: [AuthService, AuthCookieService, JwtStrategy, JwtAuthGuard],
})
export class AuthModule {}
