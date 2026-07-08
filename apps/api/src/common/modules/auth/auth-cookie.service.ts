import { Injectable } from '@nestjs/common';
import { env } from '@tooling/env/server';
import type { Response } from 'express';

const MAX_AGE = 1000 * 60 * 60 * 24 * 7;

@Injectable()
export class AuthCookieService {
  private readonly cookieName = 'access_token';

  setToken(response: Response, token: string) {
    response.cookie(this.cookieName, token, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: MAX_AGE,
    });
  }

  clearToken(response: Response) {
    response.clearCookie(this.cookieName, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
  }
}
